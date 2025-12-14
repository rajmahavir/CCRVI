import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Cloud } from "lucide-react";
import { useConfig } from "./ConfigProvider";
import { TransformerList } from "./TransformerList";
import { api } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const VERTEX_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.5-pro",
  "gemini-3.0-pro-preview",
  "gemini-3.0-pro"
];

const VERTEX_REGIONS = [
  "us-central1",
  "us-west1",
  "us-east4",
  "us-east1",
  "europe-west1",
  "asia-northeast1"
];

export function Transformers() {
  const { t } = useTranslation();
  const { config, setConfig } = useConfig();
  const [editingTransformerIndex, setEditingTransformerIndex] = useState<number | null>(null);
  const [deletingTransformerIndex, setDeletingTransformerIndex] = useState<number | null>(null);
  const [newTransformer, setNewTransformer] = useState<{ name?: string; path: string; options: { [key: string]: string } } | null>(null);

  // Vertex AI Dialog State
  const [isVertexDialogOpen, setIsVertexDialogOpen] = useState(false);
  const [vertexModel, setVertexModel] = useState("gemini-2.5-flash");
  const [vertexRegion, setVertexRegion] = useState("us-central1");
  const [vertexFile, setVertexFile] = useState<File | null>(null);
  const [isVertexLoading, setIsVertexLoading] = useState(false);
  const [vertexError, setVertexError] = useState<string | null>(null);
  const [detectedProjectId, setDetectedProjectId] = useState<string | null>(null);
  const [isDefaultModel, setIsDefaultModel] = useState(true);

  // Handle case where config is null or undefined
  if (!config) {
    return (
      <Card className="flex h-full flex-col rounded-lg border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b p-4">
          <CardTitle className="text-lg">{t("transformers.title")}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow flex items-center justify-center p-4">
          <div className="text-gray-500">Loading transformers configuration...</div>
        </CardContent>
      </Card>
    );
  }

  // Validate config.Transformers to ensure it's an array
  const validTransformers = Array.isArray(config.transformers) ? config.transformers : [];

  const handleAddTransformer = () => {
    const newTransformer = { name: "", path: "",  options: {} };
    setNewTransformer(newTransformer);
    setEditingTransformerIndex(validTransformers.length); // Use the length as index for the new item
  };

  const handleRemoveTransformer = (index: number) => {
    const newTransformers = [...validTransformers];
    newTransformers.splice(index, 1);
    setConfig({ ...config, transformers: newTransformers });
    setDeletingTransformerIndex(null);
  };

  const handleTransformerChange = (index: number, field: string, value: string, parameterKey?: string) => {
    if (index < validTransformers.length) {
      // Editing an existing transformer
      const newTransformers = [...validTransformers];
      if (parameterKey !== undefined) {
        newTransformers[index].options![parameterKey] = value;
      } else {
        (newTransformers[index] as unknown as Record<string, unknown>)[field] = value;
      }
      setConfig({ ...config, transformers: newTransformers });
    } else {
      // Editing the new transformer
      if (newTransformer) {
        const updatedTransformer = { ...newTransformer };
        if (parameterKey !== undefined) {
          updatedTransformer.options![parameterKey] = value;
        } else {
          (updatedTransformer as Record<string, unknown>)[field] = value;
        }
        setNewTransformer(updatedTransformer);
      }
    }
  };

  const editingTransformer = editingTransformerIndex !== null ? 
    (editingTransformerIndex < validTransformers.length ? 
      validTransformers[editingTransformerIndex] : 
      newTransformer) : 
    null;

  const handleSaveTransformer = () => {
    if (newTransformer && editingTransformerIndex === validTransformers.length) {
      // Saving a new transformer
      const newTransformers = [...validTransformers, newTransformer];
      setConfig({ ...config, transformers: newTransformers });
    }
    // Close the dialog
    setEditingTransformerIndex(null);
    setNewTransformer(null);
  };

  const handleCancelTransformer = () => {
    // Close the dialog without saving
    setEditingTransformerIndex(null);
    setNewTransformer(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setVertexFile(file || null);
    setDetectedProjectId(null);
    setVertexError(null);

    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const text = event.target?.result as string;
          const json = JSON.parse(text);
          if (json.project_id && json.private_key) {
            setDetectedProjectId(json.project_id);
          } else {
            setVertexError("Invalid Key File: Missing 'project_id' or 'private_key'");
          }
        } catch (err) {
          setVertexError("Invalid JSON file");
        }
      };
      reader.readAsText(file);
    }
  };

  const handleVertexSubmit = async () => {
    if (!vertexFile) {
      setVertexError("Please select a service account key file.");
      return;
    }

    if (vertexError) {
      return; // Don't submit if there's a validation error
    }

    setIsVertexLoading(true);
    setVertexError(null);

    try {
      // 1. Upload the key file
      const result = await api.uploadServiceAccountKey(vertexFile);

      if (!result.success) {
        throw new Error(result.message || "Failed to upload key");
      }

      // 2. Create the transformer configuration
      const transformerName = `vertex-${vertexModel}-${Date.now()}`; // Unique name
      const newVertexTransformer = {
        name: transformerName, // Use unique name for reference
        path: "vertex-gemini",
        options: {
          model: vertexModel,
          GOOGLE_CLOUD_PROJECT: result.projectId,
          GOOGLE_CLOUD_LOCATION: vertexRegion,
          GOOGLE_APPLICATION_CREDENTIALS: result.filePath
        }
      };

      // 3. Update Transformers List
      const newTransformers = [...validTransformers, newVertexTransformer];

      // 4. Update Providers List
      // We use 'any' here to avoid strict type issues as Provider type isn't fully available in this file
      const validProviders = Array.isArray(config.Providers) ? [...config.Providers] : [];
      let vertexProviderIndex = validProviders.findIndex((p: any) => p.name === "Vertex AI");
      
      if (vertexProviderIndex === -1) {
        // Create new provider
        const newProvider = {
          name: "Vertex AI",
          api_base_url: "https://vertex-ai.google", // Placeholder
          api_key: "not-needed",
          models: [vertexModel],
          transformer: {
            [vertexModel]: { use: [transformerName] }
          }
        };
        validProviders.push(newProvider);
      } else {
        // Update existing provider
        const existingProvider = { ...validProviders[vertexProviderIndex] };
        
        // Add model if not exists
        if (!existingProvider.models.includes(vertexModel)) {
          existingProvider.models = [...existingProvider.models, vertexModel];
        }
        
        // Update transformer mapping
        existingProvider.transformer = {
          ...(existingProvider.transformer || {}),
          [vertexModel]: { use: [transformerName] }
        };
        
        validProviders[vertexProviderIndex] = existingProvider;
      }

      // 5. Update Router Config (Set as Default)
      let newRouterConfig = { ...(config.Router || {}) };
      if (isDefaultModel) {
        const modelSelection = `Vertex AI,${vertexModel}`;
        newRouterConfig = {
          ...newRouterConfig,
          default: modelSelection,
          // Optionally set others if they are empty
          think: newRouterConfig.think || modelSelection,
          background: newRouterConfig.background || modelSelection
        };
      }

      // 6. Save Global Config
      const finalConfig = { 
        ...config, 
        transformers: newTransformers,
        Providers: validProviders,
        Router: newRouterConfig
      };

      // Persist to server immediately
      await api.updateConfig(finalConfig);

      // Update local UI state
      setConfig(finalConfig);

      // 7. Close dialog and reset
      setIsVertexDialogOpen(false);
      setVertexFile(null);
      setVertexModel("gemini-2.5-flash");
      setDetectedProjectId(null);
      
    } catch (err) {
      console.error("Vertex setup failed:", err);
      setVertexError((err as Error).message || "Failed to setup Vertex AI");
    } finally {
      setIsVertexLoading(false);
    }
  };

  return (
    <Card className="flex h-full flex-col rounded-lg border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between border-b p-4">
        <CardTitle className="text-lg">{t("transformers.title")} <span className="text-sm font-normal text-gray-500">({validTransformers.length})</span></CardTitle>
        <div className="flex gap-2">
          <Button onClick={() => setIsVertexDialogOpen(true)} variant="outline" className="gap-2">
            <Cloud className="h-4 w-4" />
            Add Vertex AI
          </Button>
          <Button onClick={handleAddTransformer}>{t("transformers.add")}</Button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto p-4">
        <TransformerList
          transformers={validTransformers}
          onEdit={setEditingTransformerIndex}
          onRemove={setDeletingTransformerIndex}
        />
      </CardContent>

      {/* Edit Dialog */}
      <Dialog open={editingTransformerIndex !== null} onOpenChange={handleCancelTransformer}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("transformers.edit")}</DialogTitle>
          </DialogHeader>
          {editingTransformer && editingTransformerIndex !== null && (
            <div className="space-y-4 py-4 px-6 max-h-96 overflow-y-auto">
              <div className="space-y-2">
                <Label htmlFor="transformer-path">{t("transformers.path")}</Label>
                <Input 
                  id="transformer-path" 
                  value={editingTransformer.path || ''} 
                  onChange={(e) => handleTransformerChange(editingTransformerIndex, "path", e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>{t("transformers.parameters")}</Label>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const parameters = editingTransformer.options || {};
                      const newKey = `param${Object.keys(parameters).length + 1}`;
                      if (editingTransformerIndex !== null) {
                        const newParameters = { ...parameters, [newKey]: "" };
                        if (editingTransformerIndex < validTransformers.length) {
                          const newTransformers = [...validTransformers];
                          newTransformers[editingTransformerIndex].options = newParameters;
                          setConfig({ ...config, transformers: newTransformers });
                        } else if (newTransformer) {
                          setNewTransformer({ ...newTransformer, options: newParameters });
                        }
                      }
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {Object.entries(editingTransformer.options || {}).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    <Input 
                      value={key} 
                      onChange={(e) => {
                        const parameters = editingTransformer.options || {};
                        const newParameters = { ...parameters };
                        delete newParameters[key];
                        newParameters[e.target.value] = value;
                        if (editingTransformerIndex !== null) {
                          if (editingTransformerIndex < validTransformers.length) {
                            const newTransformers = [...validTransformers];
                            newTransformers[editingTransformerIndex].options = newParameters;
                            setConfig({ ...config, transformers: newTransformers });
                          } else if (newTransformer) {
                            setNewTransformer({ ...newTransformer, options: newParameters });
                          }
                        }
                      }}
                      className="flex-1"
                    />
                    <Input 
                      value={value} 
                      onChange={(e) => {
                        if (editingTransformerIndex !== null) {
                          handleTransformerChange(editingTransformerIndex, "parameters", e.target.value, key);
                        }
                      }}
                      className="flex-1"
                    />
                    <Button 
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        if (editingTransformerIndex !== null) {
                          const parameters = editingTransformer.options || {};
                          const newParameters = { ...parameters };
                          delete newParameters[key];
                          if (editingTransformerIndex < validTransformers.length) {
                            const newTransformers = [...validTransformers];
                            newTransformers[editingTransformerIndex].options = newParameters;
                            setConfig({ ...config, transformers: newTransformers });
                          } else if (newTransformer) {
                            setNewTransformer({ ...newTransformer, options: newParameters });
                          }
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelTransformer}>{t("app.cancel")}</Button>
            <Button onClick={handleSaveTransformer}>{t("app.save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Vertex AI Setup Dialog */}
      <Dialog open={isVertexDialogOpen} onOpenChange={setIsVertexDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Setup Vertex AI</DialogTitle>
            <DialogDescription>
              Upload your Google Cloud Service Account JSON key to automatically configure Vertex AI.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-800 border border-blue-200">
               <strong>Note:</strong> Ensure the <code>Vertex AI API</code> is enabled in your Google Cloud Project Console for this key to work.
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="vertex-model">Model</Label>
              <select
                id="vertex-model"
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={vertexModel}
                onChange={(e) => setVertexModel(e.target.value)}
              >
                {VERTEX_MODELS.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="vertex-region">Region</Label>
              <select
                id="vertex-region"
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={vertexRegion}
                onChange={(e) => setVertexRegion(e.target.value)}
              >
                {VERTEX_REGIONS.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="vertex-file">Service Account Key (JSON)</Label>
              <Input
                id="vertex-file"
                type="file"
                accept=".json"
                onChange={handleFileChange}
              />
              {detectedProjectId && (
                 <div className="text-xs text-green-600 font-medium flex items-center mt-1">
                   ✓ Valid Key Detected (Project: {detectedProjectId})
                 </div>
              )}
            </div>
            <div className="flex items-center space-x-2 pt-2">
               <input
                 type="checkbox"
                 id="set-default"
                 className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                 checked={isDefaultModel}
                 onChange={(e) => setIsDefaultModel(e.target.checked)}
               />
               <Label htmlFor="set-default" className="font-normal cursor-pointer">Set as Default Model</Label>
            </div>
            {vertexError && (
              <div className="text-sm text-red-500">
                {vertexError}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsVertexDialogOpen(false)} disabled={isVertexLoading}>
              Cancel
            </Button>
            <Button onClick={handleVertexSubmit} disabled={isVertexLoading || !vertexFile || !!vertexError}>
              {isVertexLoading ? "Setting up..." : "Setup Vertex AI"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deletingTransformerIndex !== null} onOpenChange={() => setDeletingTransformerIndex(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("transformers.delete")}</DialogTitle>
            <DialogDescription>
              {t("transformers.delete_transformer_confirm")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingTransformerIndex(null)}>{t("app.cancel")}</Button>
            <Button variant="destructive" onClick={() => deletingTransformerIndex !== null && handleRemoveTransformer(deletingTransformerIndex)}>{t("app.delete")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
