const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

// export const apiRequest = async (
//   endpoint: string,
//   options: RequestInit = {}
// ): Promise<any> => {
//   const url = `${API_BASE_URL}${endpoint}`;

//   const defaultHeaders = {
//     "Content-Type": "application/json",
//   };

//   const config: RequestInit = {
//     ...options,
//     headers: {
//       ...defaultHeaders,
//       ...options.headers,
//     },
//   };

//   try {
//     const response = await fetch(url, config);

//     if (!response.ok) {
//       let errorMessage = `API request failed: ${response.status} ${response.statusText}`;
//       try {
//         const errorData = await response.json();
//         if (errorData.detail) {
//           errorMessage = errorData.detail;
//         } else if (errorData.message) {
//           errorMessage = errorData.message;
//         }
//       } catch (_) {}
//       throw new Error(errorMessage);
//     }

//     const contentType = response.headers.get("content-type");
//     if (contentType && contentType.includes("application/json")) {
//       return await response.json();
//     } else {
//       return await response.json();
//     }
//   } catch (error) {
//     console.error(`Error during API call to ${url}:`, error);
//     throw error;
//   }
// };

const getAuthToken = (): string | null => {
  return localStorage.getItem("access_token");
};

export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const url = `${API_BASE_URL}${endpoint}`;

  // Obter o token antes de definir os headers
  const token = getAuthToken();

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json", // Header padrão
  };

  // Adicionar o header de autorização se o token existir
  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders, // Inclui Content-Type e Authorization (se aplicável)
      ...options.headers, // Permite sobrescrever headers padrão se necessário
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      let errorMessage = `API request failed: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (_) {}
      throw new Error(errorMessage);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      // Se não for JSON, tenta retornar como texto ou lança erro
      // Pode ser útil para respostas vazias ou outros formatos
      const text = await response.text();
      try {
        return JSON.parse(text); // Tenta parsear se for um JSON mal sinalizado
      } catch {
        return text; // Retorna como texto se não for JSON
      }
    }
  } catch (error) {
    console.error(`Error during API call to ${url}:`, error);
    throw error;
  }
};

export const get = (endpoint: string, options?: RequestInit) =>
  apiRequest(endpoint, { ...options, method: "GET" });

export const post = (endpoint: string, data?: any, options?: RequestInit) =>
  apiRequest(endpoint, {
    ...options,
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
  });

export const put = (endpoint: string, data: any, options?: RequestInit) =>
  apiRequest(endpoint, {
    ...options,
    method: "PUT",
    body: JSON.stringify(data),
  });

export const del = (endpoint: string, options?: RequestInit) =>
  apiRequest(endpoint, { ...options, method: "DELETE" });
