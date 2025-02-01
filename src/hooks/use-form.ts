import { useState } from "react";
import myAxios from "@/lib/axios.config";

type FormDataConvertible = string | number | boolean | null | undefined;
type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type Progress = { percentage: number };

type VisitOptions<TResponse = any> = {
  onStart?: () => void;
  onFinish?: () => void;
  onSuccess?: (response: TResponse) => void;
  onError?: (error: any) => void;
  preserveState?: boolean;
  parseResponse?: (response: TResponse) => any;
  validateErrors?: (errors: any) => boolean;
};

type FormDataType = object;
type setDataByObject<TForm> = (data: TForm) => void;
type setDataByMethod<TForm> = (data: (previousData: TForm) => TForm) => void;
type setDataByKeyValuePair<TForm> = <K extends keyof TForm>(
  key: K,
  value: TForm[K],
) => void;

export interface InertiaFormProps<TForm extends FormDataType> {
  data: TForm;
  isDirty: boolean;
  errors: Partial<Record<keyof TForm, string>>;
  hasErrors: boolean;
  processing: boolean;
  progress: Progress | null;
  wasSuccessful: boolean;
  recentlySuccessful: boolean;
  setData: setDataByObject<TForm> &
    setDataByMethod<TForm> &
    setDataByKeyValuePair<TForm>;
  transform: (callback: (data: TForm) => TForm) => void;
  setDefaults(): void;
  setDefaults(field: keyof TForm, value: FormDataConvertible): void;
  setDefaults(fields: Partial<TForm>): void;
  reset: (...fields: (keyof TForm)[]) => void;
  clearErrors: (...fields: (keyof TForm)[]) => void;
  setError(field: keyof TForm, value: string): void;
  setError(errors: Record<keyof TForm, string>): void;
  submit: (
    method: Method,
    url: string,
    options?: VisitOptions,
    token?: string,
  ) => void;
  get: (url: string, options?: VisitOptions, token?: string) => void;
  patch: (url: string, options?: VisitOptions, token?: string) => void;
  post: (url: string, options?: VisitOptions, token?: string) => void;
  put: (url: string, options?: VisitOptions, token?: string) => void;
  delete: (url: string, options?: VisitOptions, token?: string) => void;
  cancel: () => void;
}

export default function useForm<TForm extends FormDataType, TResponse = any>(
  initialValues: TForm,
): InertiaFormProps<TForm> {
  const [data, setData] = useState<TForm>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof TForm, string>>>(
    {},
  );
  const [processing, setProcessing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [wasSuccessful, setWasSuccessful] = useState(false);
  const [recentlySuccessful, setRecentlySuccessful] = useState(false);

  const handleSetData: setDataByObject<TForm> &
    setDataByMethod<TForm> &
    setDataByKeyValuePair<TForm> = (
    keyOrUpdater: TForm | keyof TForm | ((previousData: TForm) => TForm),
    value?: TForm[keyof TForm],
  ) => {
    if (typeof keyOrUpdater === "function") {
      setData((prevData) => {
        setIsDirty(true);
        return keyOrUpdater(prevData);
      });
    } else if (typeof keyOrUpdater === "string" && value !== undefined) {
      setData((prevData) => {
        setIsDirty(true);
        return { ...prevData, [keyOrUpdater]: value };
      });
    } else {
      setData(() => {
        setIsDirty(true);
        return keyOrUpdater as TForm;
      });
    }
  };

  const handleSubmit = async (
    method: Method,
    url: string,
    options: VisitOptions<TResponse> = {},
    token?: string,
  ) => {
    setProcessing(true);
    setErrors({});
    if (options.onStart) options.onStart();

    try {
      // Prepare data for submission
      let submissionData: TForm | FormData = data;

      // If the data contains a File, convert it to FormData
      if (Object.values(data).some((value) => value instanceof File)) {
        const formData = new FormData();
        for (const [key, value] of Object.entries(data)) {
          if (value instanceof File) {
            formData.append(key, value);
          } else if (value !== null && value !== undefined) {
            formData.append(key, value.toString());
          }
        }
        submissionData = formData;
      }

      const response = await myAxios({
        method,
        url,
        data: submissionData,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(submissionData instanceof FormData
            ? { "Content-Type": "multipart/form-data" }
            : {}),
        },
        onUploadProgress: (event) => {
          if (event.total) {
            setProgress({
              percentage: Math.round((event.loaded * 100) / event.total),
            });
          }
        },
      });

      const parsedResponse = options.parseResponse
        ? options.parseResponse(response.data)
        : response.data;

      if (parsedResponse?.status === "success") {
        setWasSuccessful(true);
        setRecentlySuccessful(true);
        if (options.onSuccess) options.onSuccess(parsedResponse);
      } else {
        const validationErrors = parsedResponse?.errors || {};
        setErrors(
          Object.entries(validationErrors).reduce(
            (acc, [key, value]) => {
              acc[key as keyof TForm] = Array.isArray(value) ? value[0] : value;
              return acc;
            },
            {} as Partial<Record<keyof TForm, string>>,
          ),
        );
        if (options.onError) options.onError(parsedResponse);
      }
    } catch (error: any) {
      const errorData = error.response?.data || error;
      setErrors(
        Object.entries(errorData.errors || {}).reduce(
          (acc, [key, value]) => {
            acc[key as keyof TForm] = Array.isArray(value) ? value[0] : value;
            return acc;
          },
          {} as Partial<Record<keyof TForm, string>>,
        ),
      );
      if (options.onError) options.onError(errorData || error);
    } finally {
      setProcessing(false);
      if (options.onFinish) options.onFinish();
    }
  };

  return {
    data,
    isDirty,
    errors,
    hasErrors: Object.keys(errors).length > 0,
    processing,
    progress,
    wasSuccessful,
    recentlySuccessful,
    setData: handleSetData,
    transform: (callback) => setData(callback(data)),
    setDefaults: (keyOrFields?, value?) => {
      if (typeof keyOrFields === "string" && value !== undefined) {
        setData((prev) => ({ ...prev, [keyOrFields]: value }));
      } else if (typeof keyOrFields === "object") {
        setData((prev) => ({ ...prev, ...keyOrFields }));
      }
    },
    reset: (...fields) => {
      if (fields.length > 0) {
        setData((prev) => {
          const updatedData = { ...prev };
          fields.forEach(
            (field) => (updatedData[field] = initialValues[field]),
          );
          return updatedData;
        });
      } else {
        setData(initialValues);
      }
      setIsDirty(false);
    },
    clearErrors: (...fields) => {
      if (fields.length > 0) {
        setErrors((prev) => {
          const updatedErrors = { ...prev };
          fields.forEach((field) => delete updatedErrors[field]);
          return updatedErrors;
        });
      } else {
        setErrors({});
      }
    },
    setError: (keyOrErrors, value?) => {
      if (typeof keyOrErrors === "string" && value !== undefined) {
        setErrors((prev) => ({ ...prev, [keyOrErrors]: value }));
      } else if (typeof keyOrErrors === "object") {
        setErrors(keyOrErrors);
      }
    },
    submit: handleSubmit,
    get: (url, options, token) => handleSubmit("GET", url, options, token),
    post: (url, options, token) => handleSubmit("POST", url, options, token),
    put: (url, options, token) => handleSubmit("PUT", url, options, token),
    patch: (url, options, token) => handleSubmit("PATCH", url, options, token),
    delete: (url, options, token) =>
      handleSubmit("DELETE", url, options, token),
    cancel: () => setProcessing(false),
  };
}
