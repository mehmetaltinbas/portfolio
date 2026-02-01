import { UserImagePlace } from '@/enums/user-image-place.enum';

export interface UpsertUserImageDto {
    file: File;
    place: UserImagePlace;
}
