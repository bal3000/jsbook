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
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        if (args.path === 'index.js') {
          return {
            loader: 'jsx',
            contents: inputCode,
          };
        }

        // Check if have already fetched this file and its in cache
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );

        // If it is return straight away
        if (cachedResult) {
          return cachedResult;
        }

        // Possible idea for module federation
        const { data, request } = await axios.get(args.path);
        const path = new URL('./', request.responseURL).pathname;
        const fileType = args.path.match(/.css$/) ? 'css' : 'jsx';
        const contents =
          fileType === 'css'
            ? `
            const style = document.createElement('style');
            style.innerText = '${data}';
            document.head.appendChild(style);
        `
            : data;

        if (data) {
          const result: esbuild.OnLoadResult = {
            loader: 'jsx',
            contents: contents,
            resolveDir: path,
          };

          await fileCache.setItem(args.path, result);
          return result;
        }
      });
    },
  };
};