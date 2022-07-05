
import http from "@/utils/axios";

export default function getStudentList() {
  return http.get<string>("college");
}
