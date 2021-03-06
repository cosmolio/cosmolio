import axios, { AxiosResponse } from 'axios';
import type { SWRConfiguration } from 'swr';

export const fetcher = (url: string) => axios.get(url).then((res: AxiosResponse) => res.data);

type SwrConfigType = 'default' | 'block' | 'once';
class SWRConfig {
	private static _instance: SWRConfig;

	public static get Instance() {
		if (!this._instance) this._instance = new this();
		return this._instance;
	}

	private configMap = new Map<string, SWRConfiguration>();

	// reference https://swr.vercel.app/docs/options#options
	private _defaultValue: SWRConfiguration = {
		fetcher,
		revalidateIfStale: true,
		revalidateOnMount: true,
		revalidateOnFocus: true,
		revalidateOnReconnect: true,
		refreshInterval: 0,
		refreshWhenHidden: false,
		refreshWhenOffline: false,
		shouldRetryOnError: true,
		dedupingInterval: 2000,
		focusThrottleInterval: 5000,
		loadingTimeout: 3000,
		errorRetryInterval: 2000,
		errorRetryCount: 2,
		fallback: undefined,
		fallbackData: undefined,
		onLoadingSlow: undefined,
		onSuccess: undefined,
		onError: undefined,
		onErrorRetry: undefined,
		compare: undefined,
		isPaused: undefined,
		use: undefined,
	};

	private constructor() {
		this.configMap.set('default', { ...this._defaultValue });
		const onceConfig: Partial<SWRConfiguration> = {
			dedupingInterval: Number.MAX_SAFE_INTEGER,
		};
		this.configMap.set('once', { ...this._defaultValue, ...onceConfig });

		const blockConfig: Partial<SWRConfiguration> = {
			dedupingInterval: 6000,
			refreshInterval: 6000,
		};
		this.configMap.set('block', { ...this._defaultValue, ...blockConfig });
	}

	public use(swrConfig: SwrConfigType) {
		const value = this.configMap.get(swrConfig);
		if (!value) throw new Error(`SwrConfig [${value}] is not set, set in SWRConfig class constructor`);
		return value;
	}

	// TODO : add custom swr options, probably required per chain as blocktimes vary
}

const swrConfig = SWRConfig.Instance;

export { swrConfig };
