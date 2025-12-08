// src/hooks/useApiFetch.ts
import { useState, useEffect, useCallback, useRef } from 'react';

interface UseApiFetchOptions<T> {
  /** Função que retorna a promise da API */
  fetchFn: () => Promise<T>;
  /** Dependências para recarregar os dados */
  dependencies?: any[];
  /** Se o fetch está habilitado */
  enabled?: boolean;
  /** Chave para cache no localStorage */
  cacheKey?: string;
  /** Tempo de cache em milissegundos (padrão: 30 segundos) */
  cacheTime?: number;
  /** Tempo de debounce para múltiplas chamadas (ms) */
  debounceTime?: number;
  /** Tentar recarregar automaticamente em caso de erro */
  retryOnError?: boolean;
  /** Número máximo de tentativas */
  maxRetries?: number;
}

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

export function useApiFetch<T>({
  fetchFn,
  dependencies = [],
  enabled = true,
  cacheKey,
  cacheTime = 30000, // 30 segundos
  debounceTime = 300,
  retryOnError = false,
  maxRetries = 3
}: UseApiFetchOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Função para obter dados do cache
  const getCachedData = useCallback((): T | null => {
    if (!cacheKey) return null;

    try {
      const cached = localStorage.getItem(cacheKey);
      if (!cached) return null;

      const cacheItem: CacheItem<T> = JSON.parse(cached);
      const isExpired = Date.now() - cacheItem.timestamp > cacheTime;

      if (!isExpired) {
        console.log(`📦 Retornando dados do cache: ${cacheKey}`);
        return cacheItem.data;
      }

      // Limpar cache expirado
      localStorage.removeItem(cacheKey);
      return null;
    } catch (error) {
      console.error('❌ Erro ao ler cache:', error);
      return null;
    }
  }, [cacheKey, cacheTime]);

  // Função para salvar no cache
  const saveToCache = useCallback((data: T) => {
    if (!cacheKey) return;

    try {
      const cacheItem: CacheItem<T> = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(cacheKey, JSON.stringify(cacheItem));
      console.log(`💾 Dados salvos no cache: ${cacheKey}`);
    } catch (error) {
      console.error('❌ Erro ao salvar cache:', error);
    }
  }, [cacheKey]);

  // Função principal para buscar dados
  const fetchData = useCallback(async (isRetry = false) => {
    if (!enabled) return;

    // Cancelar requisição anterior se existir
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Criar novo AbortController
    abortControllerRef.current = new AbortController();

    // Verificar cache primeiro (exceto em retentativas)
    if (!isRetry && cacheKey) {
      const cachedData = getCachedData();
      if (cachedData) {
        setData(cachedData);
        return;
      }
    }

    try {
      if (!isRetry) {
        setLoading(true);
        setError(null);
      }

      console.log('🌐 Buscando dados da API...');
      const result = await fetchFn();

      setData(result);
      setRetryCount(0);

      // Salvar no cache
      if (cacheKey) {
        saveToCache(result);
      }

    } catch (err: any) {
      console.error('❌ Erro no fetch:', err);

      // Ignorar erros de abort
      if (err.name === 'AbortError') {
        console.log('⚠️ Requisição cancelada');
        return;
      }

      setError(err.response?.data?.detail || err.message || 'Erro desconhecido');

      // Tentar novamente em caso de erro
      if (retryOnError && retryCount < maxRetries) {
        console.log(`🔄 Tentando novamente... (${retryCount + 1}/${maxRetries})`);
        setRetryCount(prev => prev + 1);

        // Aguardar antes de tentar novamente (exponencial backoff)
        const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
        setTimeout(() => fetchData(true), delay);
      }

    } finally {
      if (!isRetry) {
        setLoading(false);
      }
    }
  }, [fetchFn, enabled, cacheKey, getCachedData, saveToCache, retryOnError, retryCount, maxRetries]);

  // Função com debounce para evitar múltiplas chamadas
  const debouncedFetch = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      fetchData();
    }, debounceTime);
  }, [fetchData, debounceTime]);

  // Refetch manual
  const refetch = useCallback(() => {
    console.log('🔄 Recarregando dados...');

    // Limpar cache se existir
    if (cacheKey) {
      localStorage.removeItem(cacheKey);
    }

    // Resetar estados
    setRetryCount(0);

    // Buscar dados
    fetchData();
  }, [fetchData, cacheKey]);

  // Efeito para buscar dados quando dependências mudam
  useEffect(() => {
    if (!enabled) return;

    debouncedFetch();

    // Cleanup
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [enabled, debouncedFetch, ...dependencies]);

  // Efeito para recarregar quando store muda
  useEffect(() => {
    if (dependencies.length > 0) {
      refetch();
    }
  }, [JSON.stringify(dependencies)]);

  return {
    data,
    loading,
    error,
    refetch,
    retryCount,
    isCached: cacheKey ? !!getCachedData() : false
  };
}

// Hook simplificado para listagens comuns
export function useApiList<T>(fetchFn: () => Promise<T[]>, options?: Omit<UseApiFetchOptions<T[]>, 'fetchFn'>) {
  return useApiFetch<T[]>({ fetchFn, ...options });
}

// Hook para dados únicos
export function useApiItem<T>(fetchFn: () => Promise<T>, options?: Omit<UseApiFetchOptions<T>, 'fetchFn'>) {
  return useApiFetch<T>({ fetchFn, ...options });
}