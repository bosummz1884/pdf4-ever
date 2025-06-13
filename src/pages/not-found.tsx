// Update the import path below to the correct location of your Card components.
// For example, if your components are in 'src/components/ui/card.tsx', use:
import { Card, CardContent } from "../components/ui/card";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-gray-50"
      data-oid="hcg72b0"
    >
      <Card className="w-full max-w-md mx-4" data-oid=".4m6540">
        <CardContent className="pt-6" data-oid="7.fu7qy">
          <div className="flex mb-4 gap-2" data-oid="d3mn:nj">
            <AlertCircle className="h-8 w-8 text-red-500" data-oid="m9sus14" />
            <h1 className="text-2xl font-bold text-gray-900" data-oid="0gmxxth">
              404 Page Not Found
            </h1>
          </div>

          <p className="mt-4 text-sm text-gray-600" data-oid="mphq-ay">
            Did you forget to add the page to the router?
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
