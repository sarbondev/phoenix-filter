import { Document, Types } from "mongoose";
import { TranslatedField } from "../../shared/types/common.types";

export type SmallCardVariant = "blue" | "ink";

export interface IHeroSmallCard {
  title: TranslatedField;
  subtitle: TranslatedField;
  description: TranslatedField;
  ctaLabel: TranslatedField;
  ctaHref: string;
  image: string;
  variant: SmallCardVariant;
}

export interface IHeroMainCard {
  title: TranslatedField;
  subtitle: TranslatedField;
  features: TranslatedField[];
  ctaLabel: TranslatedField;
  ctaHref: string;
  image: string;
}

export interface IHeroContent extends Document {
  _id: Types.ObjectId;
  mainCard: IHeroMainCard;
  smallCard1: IHeroSmallCard;
  smallCard2: IHeroSmallCard;
  createdAt: Date;
  updatedAt: Date;
}

export interface HeroContentResponse {
  mainCard: IHeroMainCard;
  smallCard1: IHeroSmallCard;
  smallCard2: IHeroSmallCard;
}

export const toHeroContentResponse = (
  h: IHeroContent,
): HeroContentResponse => ({
  mainCard: h.mainCard,
  smallCard1: h.smallCard1,
  smallCard2: h.smallCard2,
});
