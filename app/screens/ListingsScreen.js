import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';

import ActivityIndicator from '../components/ActivityIndicator';
import Screen from '../components/Screen';
import Card from '../components/Card';
import colors from '../config/colors';
import routes from '../navigation/routes';
import listingsApi from '../api/listings';
import AppText from '../components/AppText';
import AppButton from '../components/AppButton';
import useApi from '../hooks/useApi';

function ListingsScreen({ navigation }) {
  const [ refreshing, setRefresing ] = useState(false);
  const getListingsApi = useApi(listingsApi.getListings);
  
  useEffect(() => {
    getListingsApi.request();
  }, [getListingsApi.data.length, ]);

  return (
    <>
      <ActivityIndicator visible={getListingsApi.loading} />
      <Screen style={styles.screen}>
        {getListingsApi.error && <>
          <AppText>Couldn't retrieve the listings.</AppText>
          <AppButton title="Retry" onPress={loadListings}/>
        </>}
        <FlatList 
          data={getListingsApi.data.sort((a, b) => (a.id > b.id) ? 1 : -1)}
          keyExtractor={listing => listing.id.toString()}
          renderItem={
            ({ item }) => 
              <Card
                title={item.title}
                subTitle={"$" + item.price}
                imageUrl={item.images[0].url}
                onPress={() => navigation.navigate(routes.LISTING_DETAILS, item)}
                thumbnailUrl={item.images[0].thumbnailUrl}
              />
          }
          refreshing={refreshing}
          onRefresh={() => {
            getListingsApi.request();
          }}
        />
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 20,
    backgroundColor: colors.light,
  }
})

export default ListingsScreen;