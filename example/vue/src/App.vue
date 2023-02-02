<template>
  <WalletButton :autoConnect="true"></WalletButton>

  <span>Address is: {{ walletStore.address }}</span>
</template>

<script setup lang="ts">
  import { walletStore } from '@3njoylabs/aptos-wallet-adapter';
</script>

<style scoped></style>

