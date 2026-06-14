import { useState } from 'react';
import { Palette } from 'lucide-react';
import { ModuleHeader } from '@/components/ui/ModuleHeader';
import { FormField } from '@/components/ui/FormField';
import { SaveBar } from '@/components/ui/SaveBar';
import { useGuild } from '@/context/GuildContext';

export default function EmbedBuilder() {
  const { updateConfig } = useGuild();
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#3b82f6');
  const [author, setAuthor] = useState('');
  const [footer, setFooter] = useState('');
  const [fields, setFields] = useState<Array<{ name: string; value: string; inline: boolean }>>([]);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldValue, setNewFieldValue] = useState('');

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      await updateConfig({});
      setIsDirty(false);
    } catch (err) {
      setError('Failed to save embed');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setTitle('');
    setDescription('');
    setColor('#3b82f6');
    setAuthor('');
    setFooter('');
    setFields([]);
    setIsDirty(false);
  };

  const addField = () => {
    if (newFieldName && newFieldValue) {
      setFields([...fields, { name: newFieldName, value: newFieldValue, inline: false }]);
      setNewFieldName('');
      setNewFieldValue('');
      setIsDirty(true);
    }
  };

  const removeField = (idx: number) => {
    setFields(fields.filter((_, i) => i !== idx));
    setIsDirty(true);
  };

  return (
    <div className="space-y-6">
      <ModuleHeader
        icon={Palette}
        title="Embed Builder"
        description="Create custom Discord embeds"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">Embed Content</h3>
            <div className="space-y-4">
              <FormField label="Title">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="Embed title"
                  className="w-full rounded border border-slate-300 px-3 py-2"
                />
              </FormField>

              <FormField label="Description">
                <textarea
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="Embed description"
                  className="h-24 w-full rounded border border-slate-300 p-2"
                />
              </FormField>

              <FormField label="Color">
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => {
                      setColor(e.target.value);
                      setIsDirty(true);
                    }}
                    className="h-10 w-16 rounded border border-slate-300"
                  />
                  <code className="text-sm text-slate-600">{color}</code>
                </div>
              </FormField>

              <FormField label="Author">
                <input
                  type="text"
                  value={author}
                  onChange={(e) => {
                    setAuthor(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="Author name"
                  className="w-full rounded border border-slate-300 px-3 py-2"
                />
              </FormField>

              <FormField label="Footer">
                <input
                  type="text"
                  value={footer}
                  onChange={(e) => {
                    setFooter(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="Footer text"
                  className="w-full rounded border border-slate-300 px-3 py-2"
                />
              </FormField>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">Fields</h3>
            <div className="mb-4 space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newFieldName}
                  onChange={(e) => setNewFieldName(e.target.value)}
                  placeholder="Field name"
                  className="flex-1 rounded border border-slate-300 px-3 py-2"
                />
                <button
                  onClick={addField}
                  className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              <textarea
                value={newFieldValue}
                onChange={(e) => setNewFieldValue(e.target.value)}
                placeholder="Field value"
                className="w-full rounded border border-slate-300 p-2"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              {fields.map((field, idx) => (
                <div key={idx} className="flex items-start justify-between rounded bg-slate-100 p-3">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{field.name}</p>
                    <p className="text-xs text-slate-600">{field.value}</p>
                  </div>
                  <button
                    onClick={() => removeField(idx)}
                    className="text-red-600 hover:text-red-700 ml-2"
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold">Preview</h3>
          <div
            className="rounded-lg border-l-4 p-4 text-white"
            style={{ backgroundColor: color, borderLeftColor: color }}
          >
            {author && <p className="text-xs mb-2 opacity-75">{author}</p>}
            {title && <p className="font-bold text-lg mb-2">{title}</p>}
            {description && <p className="text-sm mb-3">{description}</p>}

            {fields.length > 0 && (
              <div className="space-y-2 my-3">
                {fields.map((field, idx) => (
                  <div key={idx}>
                    <p className="text-xs font-bold">{field.name}</p>
                    <p className="text-xs opacity-75">{field.value}</p>
                  </div>
                ))}
              </div>
            )}

            {footer && <p className="text-xs mt-3 opacity-75">- {footer}</p>}
          </div>
        </div>
      </div>

      <SaveBar
        isDirty={isDirty}
        isSaving={isSaving}
        onSave={handleSave}
        onReset={handleReset}
        error={error}
      />
    </div>
  );
}
