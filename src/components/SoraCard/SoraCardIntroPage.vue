<template>
  <div class="container sora-card">
    <div class="sora-card__image">
      <sora-card />
    </div>
    <div class="sora-card__intro">
      <span class="sora-card__intro-name">SORA CARD</span>
      <h3 class="sora-card__intro-title">Get a debit card connected to your SORA Wallet</h3>
      <span class="sora-card__intro-info">
        Pay with your crypto online, in-store or withdraw in ATM with Euro IBAN & Debit card
      </span>
    </div>
    <s-button
      type="primary"
      class="sora-card__btn s-typography-button--large"
      :loading="loading || !isPriceCalculated"
      @click="handleConfirm"
    >
      <span class="text"> {{ buttonText }}</span>
    </s-button>
    <div v-if="isPriceCalculated && isLoggedIn" class="sora-card__balance-indicator">
      <s-icon :class="getIconClass()" name="basic-check-mark-24" size="16px" />
      <p class="sora-card__balance-indicator-text">{{ balanceIndicatorText }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import { mixins } from '@soramitsu/soraneo-wallet-web';
import { FPNumber } from '@sora-substrate/math';
import SoraCard from '@/assets/img/sora-card/sora-card.svg?inline';
import { getter, state } from '@/store/decorators';
import { PageNames } from '@/consts';
import router from '@/router';
import { delay, clearTokensFromSessionStorage } from '@/utils';
import TranslationMixin from '../mixins/TranslationMixin';

@Component({
  components: {
    SoraCard,
  },
})
export default class SoraCardIntroPage extends Mixins(mixins.LoadingMixin, TranslationMixin) {
  @state.soraCard.euroBalance private euroBalance!: string;
  @state.soraCard.xorToDeposit private xorToDeposit!: FPNumber;
  @getter.soraCard.isEuroBalanceEnough private isEuroBalanceEnough!: boolean;
  @getter.wallet.account.isLoggedIn isLoggedIn!: boolean;

  isPriceCalculated = false;

  get buttonText(): string {
    if (!this.isLoggedIn) {
      return this.t('connectWalletText');
    }
    if (this.isEuroBalanceEnough) {
      return 'APPLY FOR CARD';
    }
    return `GET ${100 - parseInt(this.euroBalance, 10)}€ OF XOR TO QUALIFY`;
  }

  get balanceIndicatorText(): string {
    const euroBalance = parseInt(this.euroBalance, 10);
    return `${this.isEuroBalanceEnough ? '100' : euroBalance}€/100€ of XOR in your wallet`;
  }

  getIconClass(): string {
    if (this.isEuroBalanceEnough) {
      return 'sora-card__icon--checked';
    }
    return '';
  }

  handleConfirm(): void {
    if (!this.isLoggedIn) {
      router.push({ name: PageNames.Wallet });
      return;
    }
    if (!this.isEuroBalanceEnough) {
      router.push({ name: PageNames.Bridge, params: { xorToDeposit: this.xorToDeposit.toString() } });
    }

    this.$emit('confirm-apply');
  }

  async priceLoading(): Promise<void> {
    this.isPriceCalculated = false;
    await delay(800);
    this.isPriceCalculated = true;
  }

  mounted(): void {
    this.priceLoading();
    clearTokensFromSessionStorage();
  }
}
</script>

<style lang="scss" scoped>
$color: #ee2233;
.sora-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &__intro {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    &-title {
      width: 85%;
      text-align: center;
      font-weight: 600;
    }

    &-info {
      margin-top: 16px;
      font-weight: 300;
      width: 80%;
      text-align: center;
    }

    &-name {
      margin: 24px;
      font-size: 18px;
      font-weight: 600;
      color: #fff;
    }
  }

  &__image {
    margin-top: -56px;
    height: 311px;
  }

  &__balance-indicator {
    margin-top: 24px;
    &-text {
      display: inline-block;
      font-size: 16px;
    }

    .s-icon-basic-check-mark-24 {
      margin-right: 16px;
      color: var(--s-color-base-content-tertiary);
    }

    .sora-card__icon--checked {
      color: $color;
    }
  }
}

.el-button.is-loading {
  background-color: unset !important;
}
</style>
