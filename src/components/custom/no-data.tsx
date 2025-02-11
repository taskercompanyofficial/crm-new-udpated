import { Loader, RefreshCcw } from "lucide-react";
import { Button } from "../ui/button";
import { AlertCircle } from "lucide-react";
import { CardContent } from "../ui/card";
import React, { FormEvent } from "react";
import { Card } from "../ui/card";
import { revalidate } from "@/actions/revalidate";
import { toast } from "react-toastify";

export default function ErrorNoData() {
  const [revalidating, setRevalidating] = React.useState(false);
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setRevalidating(true);
    try {
      await revalidate({ path: "/" });
    } catch (error) {
      toast.error("Failed to refresh data");
    } finally {
      setRevalidating(false);
    }
  };
  return (
    <Card>
      <CardContent className="flex h-[400px] flex-col items-center justify-center gap-4">
        <AlertCircle className="h-16 w-16 text-muted-foreground/50" />
        <div className="text-center">
          <h3 className="text-lg font-semibold">No Data Available</h3>
          <p className="text-sm text-muted-foreground">
            There are currently no installation records to display.
          </p>
        </div>
        <Button variant="outline" onClick={onSubmit} className="gap-2">
          <form onSubmit={onSubmit}>
            <React.Fragment>
              {revalidating ? (
                <Loader size={15} className="animate-spin" />
              ) : (
                <button type="submit" className="flex items-center gap-1">
                  <RefreshCcw size={15} className="cursor-pointer" />
                  Refresh Data
                </button>
              )}
            </React.Fragment>
          </form>
        </Button>
      </CardContent>
    </Card>
  );
}
