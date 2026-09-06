import type { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  if (process.env.LC_APP_VARIANT !== 'v110-test') return config as ExpoConfig;
  return {
    ...config,
    name: 'Liste & Compre V1.1 Teste',
    slug: config.slug!,
    scheme: 'listecomprev110test',
    android: { ...config.android, package: 'com.marcuscamargo.listecompre.v110test' },
    ios: { ...config.ios, bundleIdentifier: 'com.marcuscamargo.listecompre.v110test' },
  };
};
