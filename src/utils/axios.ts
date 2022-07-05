import axios, {
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse,
} from "axios";

import { ElMessage, ElLoading } from "element-plus";

type TAxiosOption = {
  baseURL: string;
  timeout: number;
};

type IResponseData<T> = {
  code: number;
  data: Array<T>;
  message: string;
};

const config = {
  baseURL: "https://mock.apifox.cn/m1/1218618-0-default",
  timeout: 5000,
};

let loading:any;

class Http {
  // service: AxiosInstance;
  service;
  constructor(config: TAxiosOption) {
    this.service = axios.create(config);

    /* 请求拦截  this.service.interceptors.request.use(config => config, error => Promise.reject(error))*/
    this.service.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        loading = ElLoading.service({
          lock: true,
          text: "加载中~~~~",
          // spinner: 'el-icon-loading',
          background: "rgba(0, 0, 0, 0.7)",
        });

        (config.headers as AxiosRequestHeaders).apifoxToken =
          "DSOC200Mpy1t45ZJDwf6whiNjuQWI3rw";

        if (localStorage.getItem("token")) {
          (config.headers as AxiosRequestHeaders).authorization =
            localStorage.getItem("token") as string;
        }
        return config;
      },
      (error) => {
        loading.close();
        console.log("error");
        return Promise.reject(error); // 为了可以在代码中catch到错误信息
      }
    );

    /* 响应拦截   this.service.interceptors.response.use(response => response.data, error => Promise.reject(error))*/
    this.service.interceptors.response.use(
      (response: AxiosResponse<any>) => {
        ElMessage.success("请求成功");
        loading.close();
        const data = response.data;
        return response.data;
      },
      (error) => {
        loading.close();
        ElMessage.error("请求失败");
        return Promise.reject(error);
      }
    );
  }

  get<T>(
    url: string,
    params?: object,
    _object = {}
  ): Promise<IResponseData<T>> {
    return this.service.get(url, { params, ..._object });
  }
  post<T>(
    url: string,
    params?: object,
    _object = {}
  ): Promise<IResponseData<T>> {
    return this.service.post(url, params, _object);
  }
  put<T>(
    url: string,
    params?: object,
    _object = {}
  ): Promise<IResponseData<T>> {
    return this.service.put(url, params, _object);
  }
  delete<T>(
    url: string,
    params?: any,
    _object = {}
  ): Promise<IResponseData<T>> {
    return this.service.delete(url, { params, ..._object });
  }
}

export default new Http(config);
