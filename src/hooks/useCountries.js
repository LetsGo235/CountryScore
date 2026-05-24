import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';

/**
 * Hook to fetch and manage countries from Supabase
 * @returns {{ countries: Array, loading: boolean, error: Error|null, refetch: Function }}
 */
export function useCountries() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCountries = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('countries')
        .select('*')
        .order('name', { ascending: true });

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      setCountries(data || []);
    } catch (err) {
      console.error('Error fetching countries:', err);
      setError(err);
      setCountries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  return {
    countries,
    loading,
    error,
    refetch: fetchCountries,
  };
}

/**
 * Hook to search countries by name or code
 * @param {string} query - Search query
 * @returns {{ countries: Array, loading: boolean, error: Error|null }}
 */
export function useCountriesSearch(query = '') {
  const { countries, loading, error } = useCountries();
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query.trim()) {
      setResults(countries);
      return;
    }

    const q = query.toLowerCase();
    const filtered = countries.filter(
      (country) =>
        country.name.toLowerCase().includes(q) ||
        country.code?.toLowerCase().includes(q) ||
        country.region?.toLowerCase().includes(q)
    );

    setResults(filtered);
  }, [query, countries]);

  return {
    countries: results,
    loading,
    error,
  };
}

/**
 * Hook to get a single country by name
 * @param {string} countryName - Country name to fetch
 * @returns {{ country: Object|null, loading: boolean, error: Error|null }}
 */
export function useCountry(countryName) {
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(!!countryName);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!countryName) {
      setCountry(null);
      setLoading(false);
      return;
    }

    const fetchCountry = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: supabaseError } = await supabase
          .from('countries')
          .select('*')
          .eq('name', countryName)
          .single();

        if (supabaseError) {
          if (supabaseError.code === 'PGRST116') {
            // No row found
            setCountry(null);
          } else {
            throw new Error(supabaseError.message);
          }
        } else {
          setCountry(data);
        }
      } catch (err) {
        console.error(`Error fetching country "${countryName}":`, err);
        setError(err);
        setCountry(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCountry();
  }, [countryName]);

  return {
    country,
    loading,
    error,
  };
}
