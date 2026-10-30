import { redirect } from "next/navigation";
import { estAdmin, adminConfigure } from "@/lib/admin-auth";
import { FormConnexion } from "./FormConnexion";
import { LogoMark } from "@/components/ui/Logo";

export const dynamic = "force-dynamic";

export default async function Connexion() {
  if (await estAdmin()) redirect("/admin");
  return (
    <div className="grid min-h-screen place-items-center bg-ink p-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8">
        <LogoMark className="size-12" />
        <h1 className="mt-5 text-2xl font-semibold">Espace administration</h1>
        <p className="mt-1 text-sm text-muted">Réservé à l&apos;équipe GCS.</p>
        {!adminConfigure() && (
          <p className="mt-4 rounded-xl bg-yellow-100 p-3 text-sm text-yellow-900">
            Configurez <code>ADMIN_PASSWORD</code> et <code>ADMIN_SECRET</code> (16 caractères min.) dans le fichier <code>.env.local</code>.
          </p>
        )}
        <FormConnexion />
      </div>
    </div>
  );
}
