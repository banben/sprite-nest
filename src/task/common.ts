import { CLUSTER_CONFIG, BROWSER_CONFIG } from '@config/index';
import { Cluster } from 'puppeteer-cluster';
import { CustomConfig } from '@type/sprite';
export const initCluster = async (config: CustomConfig | undefined): Promise<Cluster<any, any>> => {
  const clusterConfig = config ? config.cluster : {};
  const pptrConfig = config ? config.pptr : {};
  return await Cluster.launch({
    ...CLUSTER_CONFIG,
    puppeteerOptions: Object.assign(
        BROWSER_CONFIG.LaunchOption,
        {
            headless: true
        },
        pptrConfig
    ),
    ...clusterConfig
  });
};

export const validFilter = (input: string[], base: string[]): string[] =>
  input.filter(b => {
      return base.indexOf(b) !== -1;
  });
