import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {IconName} from "ngx-bootstrap-icons";

export interface CarouselItem {
  image?: string;
  name?: string;
  icon?: IconProp;
  iconName?: string
  bootstrapIconName?: IconName
}
