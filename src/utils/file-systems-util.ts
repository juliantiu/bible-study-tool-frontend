export function generateBibleBookDirPath(language: string, version: string, key: string) {
  const reformattedVersion = version.toLowerCase().replace(' ', '_');
  return `${language}/${reformattedVersion}/${key}.json`;
}