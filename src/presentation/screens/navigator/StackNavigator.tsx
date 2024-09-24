import {createStackNavigator} from '@react-navigation/stack';
import {HomeScreen} from '../home/HomeScreen';
import {PokemonScreen} from '../pokemon/PokemonScreen';
import {SearchScreen} from '../search/SearchScreen';

export type RootStackParams = {
  HomeScreen: undefined;
  PokemonScreen: {pokemonId: number};
  SearchScreen: undefined;
};

const Stack = createStackNavigator<RootStackParams>();

export function StackNavigator() {
  return (
    <Stack.Navigator 
    screenOptions={{
      headerShown: false,
    }}
    >
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="PokemonScreen" component={PokemonScreen} />
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
    </Stack.Navigator>
  );
}
