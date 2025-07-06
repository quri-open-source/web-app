import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { loadStripe, Stripe } from "@stripe/stripe-js";

const stripePublicKey = environment.stripePublicKey;

@Injectable({ providedIn: 'root' })
export class StripeService {
  private stripePromise = loadStripe(stripePublicKey);

  async redirectToCheckout(sessionId: string) {
    const stripe = await this.stripePromise;
    if (!stripe) throw new Error('Stripe.js no cargado');
    await stripe.redirectToCheckout({ sessionId });
  }
}
