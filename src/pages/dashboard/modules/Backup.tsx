import { useState } from 'react';
import { HardDrive } from 'lucide-react';
import { ModuleHeader } from '@/components/ui/ModuleHeader';
import { Toggle } from '@/components/ui/Toggle';
import { SaveBar } from '@/components/ui/SaveBar';
import { useGuild } from '@/context/GuildContext';

const mockBackups = [
  { id: 1, name: 'Auto Backup #45', date: '2024-01-14 14:30', size: '12.5 MB', status: 'complete' },
  { id: 2, name: 'Manual Backup', date: '2024-01-13 10:15', size: '12.3 MB', status: 'complete' },
  { id: 3, name: 'Auto Backup #44', date: '2024-01-12 14:30', size: '12.1 MB', status: 'complete' },
  { id: 4, name: 'Auto Backup #43', date: '2024-01-11 14:30', size: '11.9 MB', status: 'complete' },
  { id: 5, name: 'Auto Backup #42', date: '2024-01-10 14:30', size: '11.7 MB', status: 'complete' },
];

export default function Backup() {
  const { updateConfig } = useGuild();
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoBackup, setAutoBackup] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<number | null>(null);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      await updateConfig({});
      setIsDirty(false);
    } catch (err) {
      setError('Failed to save backup settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setAutoBackup(false);
    setIsDirty(false);
  };

  const handleCreateBackup = async () => {
    try {
      setIsSaving(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert('Backup created successfully!');
    } catch (err) {
      setError('Failed to create backup');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRestore = async () => {
    if (!selectedBackup) {
      alert('Please select a backup to restore');
      return;
    }

    if (!confirm('Are you sure you want to restore this backup? This will overwrite current data.')) {
      return;
    }

    try {
      setRestoring(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert('Backup restored successfully!');
      setSelectedBackup(null);
    } catch (err) {
      setError('Failed to restore backup');
    } finally {
      setRestoring(false);
    }
  };

  return (
    <div className="space-y-6">
      <ModuleHeader
        icon={HardDrive}
        title="Backup & Restore"
        description="Manage server backups and data recovery"
      />

      <div className="space-y-6">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold">Backup Management</h3>
          <div className="mb-6 flex gap-3">
            <button onClick={handleCreateBackup} className="btn-primary">
              {isSaving ? 'Creating...' : 'Create Backup Now'}
            </button>
          </div>

          <label className="flex items-center gap-3">
            <Toggle
              checked={autoBackup}
              onChange={(checked) => {
                setAutoBackup(checked);
                setIsDirty(true);
              }}
            />
            <span className="text-sm">Enable automatic daily backups</span>
          </label>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold">Backup List</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-4 py-2 text-left font-medium">
                    <input type="checkbox" className="h-4 w-4 rounded border-slate-300" />
                  </th>
                  <th className="px-4 py-2 text-left font-medium">Backup Name</th>
                  <th className="px-4 py-2 text-left font-medium">Date</th>
                  <th className="px-4 py-2 text-left font-medium">Size</th>
                  <th className="px-4 py-2 text-left font-medium">Status</th>
                  <th className="px-4 py-2 text-left font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {mockBackups.map((backup) => (
                  <tr key={backup.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-2">
                      <input
                        type="checkbox"
                        checked={selectedBackup === backup.id}
                        onChange={() => setSelectedBackup(selectedBackup === backup.id ? null : backup.id)}
                        className="h-4 w-4 rounded border-slate-300"
                      />
                    </td>
                    <td className="px-4 py-2 font-medium">{backup.name}</td>
                    <td className="px-4 py-2 text-slate-600">{backup.date}</td>
                    <td className="px-4 py-2">{backup.size}</td>
                    <td className="px-4 py-2">
                      <span className="inline-block rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                        {backup.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selectedBackup && (
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6">
            <h3 className="mb-3 font-semibold text-yellow-900">Restore Backup</h3>
            <p className="mb-4 text-sm text-yellow-800">
              Selected backup: {mockBackups.find((b) => b.id === selectedBackup)?.name}
            </p>
            <div className="mb-4 rounded bg-yellow-100 p-3 text-sm text-yellow-900">
              <strong>Warning:</strong> Restoring a backup will overwrite all current server data. This action cannot be undone.
            </div>
            <button
              onClick={handleRestore}
              className="btn-primary bg-yellow-500 text-white hover:bg-yellow-600"
              disabled={restoring}
            >
              {restoring ? 'Restoring...' : 'Confirm Restore'}
            </button>
          </div>
        )}
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
