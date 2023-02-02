<template>
  <WalletButton :autoConnect="true"></WalletButton>

  <span>Address is: {{ walletStore.address }}</span>
</template>

<script setup lang="ts">
  import { walletStore } from '@berryliu/aptos-wallet-adapter';
</script>

<style scoped></style>

