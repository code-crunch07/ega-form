import { getMockSessionUser } from "@/lib/auth";
import ProfileForm from "./profile-form";

export default async function ProfilePage() {
  const user = await getMockSessionUser();

  return <ProfileForm user={user} />;
}
