import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Button, Text, View, SafeAreaView } from 'react-native';
import { BannerAd, BannerAdSize, TestIds, InterstitialAd, AdEventType, RewardedInterstitialAd, RewardedAdEventType } from 'react-native-google-mobile-ads';
import { useState, useEffect } from 'react';



const interstitial = InterstitialAd.createForAdRequest('ca-app-pub-2626761390041139/4321796220', {
  requestNonPersonalizedAdsOnly: true
});

const rewardedInterstitial = RewardedInterstitialAd.createForAdRequest("ca-app-pub-2626761390041139/4509783896", {
  requestNonPersonalizedAdsOnly: true
});

export default function App() {
  const [interstitialLoaded, setInterstitialLoaded] = useState(false);
  const [rewardedInterstitialLoaded, setRewardedInterstitialLoaded] = useState(false);
  
  const loadInterstitial = () => {
    const unsubscribeLoaded = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        setInterstitialLoaded(true);
      }
    );

    const unsubscribeClosed = interstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        setInterstitialLoaded(false);
        interstitial.load();
      }
    );

    interstitial.load();

    return () => {
      unsubscribeClosed();
      unsubscribeLoaded();
    }
  }

  const loadRewardedInterstitial = () => {
    const unsubscribeLoaded = rewardedInterstitial.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        setRewardedInterstitialLoaded(true);
      }
    );

    const unsubscribeEarned = rewardedInterstitial.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      reward => {
        console.log(`User earned reward of ${reward.amount} ${reward.type}`);
      }
    );

    const unsubscribeClosed = rewardedInterstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        setRewardedInterstitialLoaded(false);
        rewardedInterstitial.load();
      }
    );

    rewardedInterstitial.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
      unsubscribeEarned();
    }
  };

  useEffect(() => {
    const unsubscribeInterstitialEvents = loadInterstitial();
    const unsubscribeRewardedInterstitialEvents = loadRewardedInterstitial();

    return () => {
      unsubscribeInterstitialEvents();
      unsubscribeRewardedInterstitialEvents();
    };
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        {interstitialLoaded ? <Button title="Show Interstitial" onPress={() => interstitial.show()}/> : <Text>Loading Interstitial...</Text>}
        {rewardedInterstitialLoaded ? <Button title="Show Rewarded Interstitial" onPress={() =>rewardedInterstitial.show()}/> : <Text>Loading Rewarded Interstitial...</Text>}
      </View>
      <BannerAd 
        unitId={"ca-app-pub-2626761390041139/3917643564"}
        size={BannerAdSize.LARGE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true
        }}
      />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
