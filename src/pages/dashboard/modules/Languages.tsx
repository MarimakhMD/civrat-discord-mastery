import { useState } from 'react';
import { Globe } from 'lucide-react';
import { ModuleHeader } from '@/components/ui/ModuleHeader';
import { FormField } from '@/components/ui/FormField';
import { SaveBar } from '@/components/ui/SaveBar';
import { Select } from '@/components/ui/Select';
import { useGuild } from '@/context/GuildContext';

const languages = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'pt', label: 'Português' },
  { value: 'tr', label: 'Türkçe' },
];

const messagePreviewMap: Record<string, string> = {
  en: 'Welcome to the server! Please read the rules.',
  es: '¡Bienvenido al servidor! Por favor, lee las reglas.',
  fr: 'Bienvenue sur le serveur! Veuillez lire les règles.',
  de: 'Willkommen auf dem Server! Bitte lesen Sie die Regeln.',
  pt: 'Bem-vindo ao servidor! Por favor, leia as regras.',
  tr: 'Sunucuya hoş geldiniz! Lütfen kuralları okuyun.',
};

export default function Languages() {
  const { config, updateConfig } = useGuild();
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedLanguage, setSelectedLanguage] = useState(config.language);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      await updateConfig({ language: selectedLanguage });
      setIsDirty(false);
    } catch (err) {
      setError('Failed to save language settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setSelectedLanguage(config.language);
    setIsDirty(false);
  };

  const handleLanguageChange = (val: string) => {
    setSelectedLanguage(val);
    setIsDirty(true);
  };

  return (
    <div className="space-y-6">
      <ModuleHeader
        icon={Globe}
        title="Language Settings"
        description="Configure bot language and localization"
      />

      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">Select Language</h3>
        <FormField label="Bot Language">
          <Select
            options={languages}
            value={selectedLanguage}
            onChange={handleLanguageChange}
          />
        </FormField>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">Message Preview</h3>
        <div className="rounded bg-slate-50 p-4">
          <p className="text-sm text-slate-600">Example welcome message:</p>
          <p className="mt-2 text-sm font-medium">
            {messagePreviewMap[selectedLanguage] || messagePreviewMap['en']}
          </p>
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
