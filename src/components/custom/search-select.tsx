import React, { useState, useEffect } from "react";
import { Select, Typography, Spin, Button, Space, Divider } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import type { SelectProps } from "antd";

const { Text } = Typography;

interface DataTypeIds {
  value: string;
  label: string;
  isCustom?: boolean;
}

interface SearchSelectProps {
  options: DataTypeIds[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  description?: string;
  className?: string;
  width?: "auto" | "full";
  required?: boolean;
  customizable?: boolean;
  errorMessage?: string;
  isLoading?: boolean;
  multiple?: boolean;
}

export default function SearchSelect({
  options: initialOptions,
  value,
  onChange,
  label = "",
  description = "",
  className = "",
  width = "auto",
  required = false,
  customizable = false,
  errorMessage,
  isLoading = false,
  multiple = false,
}: SearchSelectProps) {
  // Process the initial value
  const [selectedValues, setSelectedValues] = useState<string[]>(
    multiple && value ? value.split(',') : value ? [value] : []
  );
  const [searchValue, setSearchValue] = useState('');
  const [customOptions, setCustomOptions] = useState<DataTypeIds[]>([]);

  // Combine initial options with custom options
  const allOptions = [...initialOptions, ...customOptions.map(opt => ({
    ...opt,
    label: opt.isCustom ? (
      <Space>
        {opt.label}
        <DeleteOutlined 
          onClick={(e) => {
            e.stopPropagation();
            handleRemoveCustomOption(opt.value);
          }}
        />
      </Space>
    ) : opt.label
  }))].map(option => ({
    ...option,
    value: String(option.value)
  }));

  // Update the controlled value when external value changes
  useEffect(() => {
    if (multiple) {
      setSelectedValues(value ? value.split(',') : []);
    } else {
      setSelectedValues(value ? [value] : []);
    }
  }, [value, multiple]);

  const handleChange = (newValue: string | string[]) => {
    if (multiple) {
      const valueArray = Array.isArray(newValue) ? newValue : [newValue];
      setSelectedValues(valueArray);
      onChange(valueArray.join(','));
    } else {
      const singleValue = Array.isArray(newValue) ? newValue[0] : newValue;
      setSelectedValues(singleValue ? [singleValue] : []);
      onChange(singleValue || '');
    }
  };

  const handleRemoveCustomOption = (optionValue: string) => {
    setCustomOptions(prev => prev.filter(opt => opt.value !== optionValue));
    if (multiple) {
      const newValues = selectedValues.filter(val => val !== optionValue);
      setSelectedValues(newValues);
      onChange(newValues.join(','));
    } else if (selectedValues[0] === optionValue) {
      setSelectedValues([]);
      onChange('');
    }
  };

  const handleAddCustomOption = () => {
    if (!searchValue.trim()) return;
    
    const newOption: DataTypeIds = { 
      value: searchValue, 
      label: searchValue,
      isCustom: true 
    };
    setCustomOptions(prev => [...prev, newOption]);
    
    if (multiple) {
      const newValues = [...selectedValues, searchValue];
      setSelectedValues(newValues);
      onChange(newValues.join(','));
    } else {
      setSelectedValues([searchValue]);
      onChange(searchValue);
    }
    
    setSearchValue('');
  };

  // Dropdown menu for adding custom options
  const dropdownRender = (menu: React.ReactElement) => (
    <>
      {menu}
      {customizable && searchValue && (
        <>
          <Divider style={{ margin: '8px 0' }} />
          <Space style={{ padding: '0 8px 4px' }}>
            <Button
              type="text"
              icon={<PlusOutlined />}
              onClick={handleAddCustomOption}
              style={{ width: '100%', textAlign: 'left' }}
            >
              Add "{searchValue}"
            </Button>
          </Space>
        </>
      )}
    </>
  );

  // Prepare Select props
  const selectProps: SelectProps<string | string[], DataTypeIds> = {
    mode: multiple ? 'multiple' : undefined,
    showSearch: true,
    value: multiple ? selectedValues : selectedValues[0] || undefined,
    placeholder: `Select ${label.toLowerCase() || 'option'}...`,
    style: { width: width === 'full' ? '100%' : '256px' },
    onChange: handleChange,
    onSearch: setSearchValue,
    searchValue: searchValue,
    notFoundContent: isLoading ? (
      <Spin size="small" />
    ) : (
      customizable && searchValue ? (
        <Button
          type="text"
          icon={<PlusOutlined />}
          onClick={handleAddCustomOption}
          style={{ width: '100%', textAlign: 'left', padding: '8px' }}
        >
          Add "{searchValue}"
        </Button>
      ) : null
    ),
    options: allOptions as DataTypeIds[],
    allowClear: true,
    dropdownRender: customizable ? dropdownRender : undefined,
    className,
    status: errorMessage ? 'error' : undefined,
    filterOption: (input: string, option?: DataTypeIds) => {
      return option?.label.toString().toLowerCase().includes(input.toLowerCase()) ?? false;
    }
  };

  return (
    <div className={className} style={{ marginTop: '8px', paddingTop: '4px' }}>
      {label && (
        <div style={{ marginBottom: '8px' }}>
          <Text strong type={errorMessage ? "danger" : undefined}>
            {label}
            {required && <span style={{ color: '#ff4d4f' }}> *</span>}
          </Text>
        </div>
      )}

      <Select {...selectProps} />

      {description && (
        <div style={{ marginTop: '4px' }}>
          <Text type="secondary" style={{ fontSize: '14px' }}>
            {description}
          </Text>
        </div>
      )}
      
      {errorMessage && (
        <div style={{ marginTop: '4px' }}>
          <Text type="danger" style={{ fontSize: '14px' }}>
            {errorMessage}
          </Text>
        </div>
      )}
    </div>
  );
} 