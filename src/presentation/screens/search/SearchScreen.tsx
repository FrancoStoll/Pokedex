import {FlatList, View} from 'react-native';
import {globalTheme} from '../../../config/theme/global-theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ActivityIndicator, Text, TextInput} from 'react-native-paper';

import {PokemonCard} from '../../components/pokemons/PokemonCard';
import {useQuery} from '@tanstack/react-query';
import {getPokemonNamesWithId, getPokemonsById} from '../../../actions';
import {useMemo, useState} from 'react';
import {FullScreenLoader} from '../../components/ui/FullScreenLoader';
import {useDebouncedValue} from '../../hooks/useDebouncedValue';

export const SearchScreen = () => {
  const {top} = useSafeAreaInsets();
  const [term, setTerm] = useState('');
  const debouncedValue = useDebouncedValue(term);
  const {data: pokemonNameList, isLoading} = useQuery({
    queryKey: ['pokemons', 'all'],
    queryFn: () => getPokemonNamesWithId(),
  });

  const pokemonNameIdList = useMemo(() => {
    // Es un numero
    if (!pokemonNameList) return [];
    if (!isNaN(Number(debouncedValue))) {
      const pokemon = pokemonNameList?.find(poke => poke.id === Number(term));
      return pokemon ? [pokemon] : [];
    }
    if (debouncedValue.length === 0) return [];
    if (debouncedValue.length < 3) return [];

    return pokemonNameList.filter(pokemon =>
      pokemon.name.includes(debouncedValue.toLowerCase()),
    );
  }, [debouncedValue]);

  const {isLoading: isLoadingPokemons, data: pokemons = []} = useQuery({
    queryKey: ['pokemons', 'by', pokemonNameIdList],
    queryFn: () =>
      getPokemonsById(pokemonNameIdList.map(pokemon => pokemon.id)),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <View style={[globalTheme.globalMargin, {paddingTop: top + 10}]}>
      <TextInput
        placeholder="Buscar Pokémon"
        autoFocus
        autoCorrect={false}
        onChangeText={value => setTerm(value)}
        value={term}
        style={{marginBottom: 20}}
      />
      {isLoadingPokemons && <ActivityIndicator style={{paddingTop: 20}} />}

      {/* <Text>{JSON.stringify(pokemonNameIdList, null, 2)}</Text> */}

      <FlatList
        data={pokemons}
        keyExtractor={(pokemon, index) => `${pokemon.id}-${index}}`}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => <PokemonCard pokemon={item} />}
        ListFooterComponent={<View style={{height: 120}} />}
      />
    </View>
  );
};
