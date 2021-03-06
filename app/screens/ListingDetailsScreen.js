import React, { useEffect, useState } from "react";
import {
  Dimensions,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ScrollView,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import Gallery from 'react-native-image-gallery';

import colors from "../config/colors";
import ContactSellerForm from "../components/ContactSellerForm";
import ListItem from "../components/lists/ListItem";
import AppText from "../components/AppText";
import usersApi from '../api/users';
import useApi from '../hooks/useApi';
import GalleryImage from "../components/GalleryImage";

function ListingDetailsScreen({ route }) {
  const listing = route.params;
  const [ galleryImages, setGalleryImages ] = useState();

  const getUserApi = useApi(usersApi.getUser);

  const buildGalleryImages = (images) => {
    let galleryImages = [];
    images.forEach(addGalleryImage);
  
    function addGalleryImage(image) {
      const galleryImage = {
        source: {
          uri: image.url
        }
      };
      galleryImages.push(galleryImage);
    };
    setGalleryImages(galleryImages);
  };

  useEffect(() => {
    getUserApi.request(listing.userId);
    buildGalleryImages(listing.images);
  }, []);

  return (
    <ScrollView>
      <KeyboardAvoidingView
        behavior="position"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 100}
      >
        {/* <Image
          style={styles.image}
          preview={{ uri: listing.images[0].thumbnailUrl }}
          tint="light"
          uri={listing.images[0].url}
        /> */}
        <Gallery
          style={styles.image}
          initialPage="1"
          //initial image to show
          images={galleryImages}
          imageComponent={(image) => <GalleryImage image={image}/>}
        />
        <View style={styles.detailsContainer}>
          <AppText style={styles.title}>{listing.title}</AppText>
          <AppText style={styles.price}>${listing.price}</AppText>
          <View style={styles.userContainer}>
            <ListItem
              image={require("../assets/mosh.jpg")}
              title={getUserApi.data?.name}
              subTitle={getUserApi.data?.listings + " Listings"}
            />
          </View>
          <ContactSellerForm listing={listing} />
        </View>
      </KeyboardAvoidingView>
      <MapView
        style={styles.mapStyle}
        initialRegion={{
          latitude: listing.location.latitude,
          longitude: listing.location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05
        }}
      >
        <Marker coordinate={{ latitude: listing.location.latitude, longitude:listing.location.longitude }} />
      </MapView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  detailsContainer: {
    padding: 20,
  },
  image: {
    width: "100%",
    height: 300,
  },
  mapStyle: {
    width: "100%",
    height: 300,
  },
  price: {
    color: colors.secondary,
    fontWeight: "bold",
    fontSize: 20,
    marginVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "500",
  },
  userContainer: {
    marginVertical: 15,
  },
});

export default ListingDetailsScreen;
