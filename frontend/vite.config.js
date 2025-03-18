import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Plugin personnalisé pour supprimer les avertissements liés aux importations dynamiques
const suppressDynamicImportWarnings = () => {
  return {
    name: 'suppress-dynamic-import-warnings',
    configResolved(config) {
      // Intercepter et filtrer les avertissements
      const originalWarn = config.logger.warn;
      config.logger.warn = (msg, options) => {
        // Ignorer les avertissements spécifiques liés aux importations dynamiques
        if (msg.includes('invalid import') && msg.includes('file extension must be included')) {
          return;
        }
        originalWarn(msg, options);
      };
    }
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    suppressDynamicImportWarnings() // Ajouter notre plugin personnalisé
  ],
  server: {
    port: 5174,
    host: true
  },
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // Ignorer les avertissements liés aux importations dynamiques variables
        if (warning.code === 'DYNAMIC_IMPORT_VARIABLES') {
          return;
        }
        warn(warning);
      }
    }
  },
  optimizeDeps: {
    // Désactiver l'analyse des importations dynamiques pour les fichiers spécifiques
    // Note: on utilise un seul caractère wildcard pour éviter l'erreur d'ESBuild
    exclude: ['./src/components/LazyLoad/*']
  }
})
