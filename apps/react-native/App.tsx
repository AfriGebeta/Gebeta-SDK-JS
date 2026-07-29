/**
 * Gebeta Maps SDK — React Native example app.
 *
 * A tiny feature-per-page demo, mirroring the React/Svelte example apps. Pages exercise the
 * SDK against a real native map. The Directions page is the end-to-end test for the
 * declarative map store (Step 3).
 */

import { useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Directions from './src/pages/Directions';
import LocationPage from './src/pages/Location';
import Clustering from './src/pages/Clustering';
import Fencing from './src/pages/Fencing';
import Navigation from './src/pages/Navigation';
import { getAuth, type Auth } from './src/config';

type Page =
  | 'home'
  | 'directions'
  | 'location'
  | 'clustering'
  | 'fencing'
  | 'navigation';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const insets = useSafeAreaInsets();
  const [page, setPage] = useState<Page>('home');

  let auth: Auth | null = null;
  let authError: string | null = null;
  try {
    auth = getAuth();
  } catch (err) {
    authError = err instanceof Error ? err.message : String(err);
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Gebeta Maps RN</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabs}
        >
          <Tab
            label="Home"
            active={page === 'home'}
            onPress={() => setPage('home')}
          />
          <Tab
            label="Directions"
            active={page === 'directions'}
            onPress={() => setPage('directions')}
          />
          <Tab
            label="Location"
            active={page === 'location'}
            onPress={() => setPage('location')}
          />
          <Tab
            label="Cluster"
            active={page === 'clustering'}
            onPress={() => setPage('clustering')}
          />
          <Tab
            label="Fence"
            active={page === 'fencing'}
            onPress={() => setPage('fencing')}
          />
          <Tab
            label="Navigate"
            active={page === 'navigation'}
            onPress={() => setPage('navigation')}
          />
        </ScrollView>
      </View>
      <View style={styles.body}>
        {authError ? (
          <View style={styles.centered}>
            <Text style={styles.errorText}>{authError}</Text>
          </View>
        ) : page === 'home' ? (
          <View style={styles.centered}>
            <Text style={styles.homeTitle}>Gebeta Maps SDK</Text>
            <Text style={styles.homeSub}>
              Pick a demo above. "Directions" exercises the declarative map
              store.
            </Text>
          </View>
        ) : page === 'directions' ? (
          auth && <Directions auth={auth} />
        ) : page === 'location' ? (
          auth && <LocationPage auth={auth} />
        ) : page === 'clustering' ? (
          auth && <Clustering auth={auth} />
        ) : page === 'fencing' ? (
          auth && <Fencing auth={auth} />
        ) : (
          auth && <Navigation auth={auth} />
        )}
      </View>
    </View>
  );
}

function Tab({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.tab, active && styles.tabActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.tabText, active && styles.tabTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { paddingHorizontal: 12, paddingBottom: 8, backgroundColor: '#fff' },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  tabs: { flexDirection: 'row', gap: 8 },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: '#eee',
  },
  tabActive: { backgroundColor: '#007cbf' },
  tabText: { fontSize: 13, fontWeight: '600', color: '#333' },
  tabTextActive: { color: '#fff' },
  body: { flex: 1 },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  homeTitle: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  homeSub: { fontSize: 13, color: '#666', textAlign: 'center' },
  errorText: { color: '#c00', textAlign: 'center', fontSize: 13 },
});

export default App;
