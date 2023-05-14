import {IconName} from "ngx-bootstrap-icons/lib/types/icon-names.type";


export interface PromoQuizModal {
  title: string;
  subtitle: string;
  buttonText?: string;
  quizId: string;

  background: string
  category?: string;
  categoryIcon?: IconName;
}
