export interface CameraDto {
  id: number;
  petId: number;
  text: string;
}

export interface GetCamerasSuccessResponseDto {
  data: CameraDto[];
}
