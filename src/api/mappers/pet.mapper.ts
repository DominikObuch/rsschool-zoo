import type { PetDetailedDto, PetDto } from '../models/pets.dto.ts';
import { getProductImagesById } from '../../assets/product-images.ts';
import type { ProductImageSet } from '../../types.ts';

export interface PetViewModel {
  id: number;
  name: string;
  commonName: string;
  description: string;
  images: ProductImageSet;
}

export interface PetDetailedViewModel extends PetDetailedDto {
  images: ProductImageSet;
}

export function mapPetDtoToViewModel(pet: PetDto): PetViewModel {
  return {
    id: pet.id,
    name: pet.name,
    commonName: pet.commonName,
    description: pet.description,
    images: getProductImagesById(pet.id),
  };
}

export function mapPetDetailedDtoToViewModel(pet: PetDetailedDto): PetDetailedViewModel {
  return {
    ...pet,
    images: getProductImagesById(pet.id),
  };
}
