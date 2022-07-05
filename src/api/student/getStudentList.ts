import { IStudentInfo } from "@/types/student/list";
import http from "@/utils/axios";

export default function getStudentList() {
  return http.get<IStudentInfo>("student");
}
