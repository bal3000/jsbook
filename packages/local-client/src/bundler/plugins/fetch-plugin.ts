import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localforage from 'localforage';

const fileCache = localforage.createInstance({
  name: 'filecache',
});

export const fetchPlugin = (inputCode: string) => {
  return {
    name: 'fetch-plugin',
    setup(build: esbuild.PluginBuild) {
      build.onLoad({ filter: /(^index\.js$)/ }, async () => {
        return {
          loader: 'jsx',
          contents: inputCode,
        };
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        // Check if have already fetched this file and its in cache
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );

        // If it is return straight away
        if (cachedResult) {
          return cachedResult;
        }
        return null;
      });

      build.onLoad({ filter: /.css$/ }, async (args: any) => {
        // Possible idea for module federation
        const { data, request } = await axios.get(args.path);
        const path = new URL('./', request.responseURL).pathname;

        const escaped = data
          .replace(/\n/g, '')
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'");
        const contents = `
            const style = document.createElement('style');
            style.innerText = '${escaped}';
            document.head.appendChild(style);
        `;

        if (data) {
          const result: esbuild.OnLoadResult = {
            loader: 'jsx',
            contents,
            resolveDir: path,
          };

          await fileCache.setItem(args.path, result);
          return result;
        }
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        // Possible idea for module federation
        const { data, request } = await axios.get(args.path);
        const path = new URL('./', request.responseURL).pathname;

        if (data) {
          const result: esbuild.OnLoadResult = {
            loader: 'jsx',
            contents: data,
            resolveDir: path,
          };

          await fileCache.setItem(args.path, result);
          return result;
        }
      });
    },
  };
};
