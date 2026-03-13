export interface PetDto {
  id: number;
  name: string;
  commonName: string;
  description: string;
}

export interface GetPetsSuccessResponseDto {
  data: PetDto[];
}

export interface PetDetailedDto {
  id: number;
  commonName: string;
  scientificName: string;
  type: string;
  size: string;
  diet: string;
  habitat: string;
  range: string;
  latitude: string;
  longitude: string;
  description: string;
  detailedDescription: string;
}

export interface GetPetByIdSuccessResponseDto {
  data: PetDetailedDto;
}
