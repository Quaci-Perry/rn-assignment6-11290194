import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

const products = [
  { id: '1', name: 'Reversible Angora Cardigan', price: 120, image: require('./dress1.png') },
  { id: '2', name: 'Recycle Boucle Knit Cardigan Pink', price: 120, image: require('./dress2.png') },
  { id: '3', name: 'Office Wear', price: 120, image: require('./dress3.png') },
  { id: '4', name: 'Black', price: 120, image: require('./dress4.png') },
  { id: '5', name: 'Church Wear', price: 120, image: require('./dress5.png') },
  { id: '6', name: 'Lamari', price: 120, image: require('./dress6.png') },
  { id: '7', name: 'ZWN', price: 120, image: require('./dress7.png') },
  { id: '8', name: 'Lame', price: 120, image: require('./dress3.png') },
];

const HomeScreen = ({ navigation }) => {
  const [cart, setCart] = useState([]);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const loadCart = async () => {
      const storedCart = await AsyncStorage.getItem('cart');
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    };
    loadCart();
  }, []);

  const addToCart = async (product) => {
    if (adding) return;
    setAdding(true);
    const updatedCart = [...cart, product];
    setCart(updatedCart);
    await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
    setAdding(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Image source={require('./Menu.png')} style={styles.icon} />
        </TouchableOpacity>
        <Image source={require('./Logo.png')} style={styles.logo} />
        <View style={styles.rightIcons}>
          <TouchableOpacity onPress={() => { /* search functionality */ }}>
            <Image source={require('./Search.png')} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
            <Image source={require('./shoppingBag.png')} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.titleRow}>
        <Text style={styles.title}>OUR STORY</Text>
        <View style={styles.iconRow}>
          <TouchableOpacity onPress={() => { /* Listview functionality */ }}>
            <Image source={require('./Listview.png')} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { /* filter functionality */ }}>
            <Image source={require('./Filter.png')} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.productContainer}>
            <Image source={item.image} style={styles.productImage} />
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>${item.price}</Text>
            <Button title="Add to Cart" onPress={() => addToCart(item)} />
          </View>
        )}
        numColumns={2}
      />
      <Button title="Go to Cart" onPress={() => navigation.navigate('Cart')} />
    </View>
  );
};

const CartScreen = ({ navigation }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const loadCart = async () => {
      const storedCart = await AsyncStorage.getItem('cart');
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    };
    loadCart();
  }, []);

  const removeFromCart = async (product) => {
    const updatedCart = cart.filter((item) => item.id !== product.id);
    setCart(updatedCart);
    await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItemContainer}>
      <Image source={item.image} style={styles.cartItemImage} />
      <View style={styles.cartItemDetails}>
        <Text style={styles.cartItemName}>{item.name}</Text>
        <Text style={styles.cartItemPrice}>${item.price}</Text>
      </View>
      <TouchableOpacity onPress={() => removeFromCart(item)}>
        <Image source={require('./remove.png')} style={styles.removeIcon} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Image source={require('./Menu.png')} style={styles.icon} />
        </TouchableOpacity>
        <Image source={require('./Logo.png')} style={styles.logo} />
        <TouchableOpacity onPress={() => { /* search functionality */ }}>
          <Image source={require('./Search.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>CHECKOUT</Text>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id}
        renderItem={renderCartItem}
      />
      <Text style={styles.total}>EST. TOTAL: ${cart.reduce((sum, item) => sum + item.price, 0)}</Text>
    </View>
  );
};

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return <AppNavigator />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  logo: {
    width: 100,
    height: 40,
    resizeMode: 'contain',
  },
  rightIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icon: {
    width: 30,
    height: 30,
    marginHorizontal: 5,
    marginVertical: 5,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  iconRow: {
    flexDirection: 'row',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'left',
    fontStyle: 'italic', // Make the title italic
  },
  productContainer: {
    flex: 1,
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
  },
  productImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  productPrice: {
    fontSize: 16,
    color: '#888',
    marginBottom: 10,
  },
  cartItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
  },
  cartItemImage: {
    width: 80,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  cartItemDetails: {
    flex: 1,
    marginLeft: 10,
  },
  cartItemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cartItemPrice: {
    fontSize: 16,
    color: '#888',
  },
  removeIcon: {
    width: 24,
    height: 24,
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
});
