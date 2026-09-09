import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { QuizFlow } from "@/components/quiz/QuizFlow";
import { useQuiz } from "@/quiz/state";

const TITLE = "Lomove — Descubra o músculo invisível que causa sua dor";
const DESCRIPTION =
  "Diagnóstico gratuito em 2 minutos: descubra qual músculo encurtado está causando sua dor nas costas e receba um plano de alongamentos de 28 dias.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const { jump } = useQuiz();

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      
      // Se tiver #painel-admin, vai para /admin
      if (hash === "#painel-admin") {
        navigate({ to: "/admin", replace: true });
        return;
      }

      // Suporte para jump direto via hash: #step-5
      if (hash.startsWith("#step-")) {
        const indexStr = hash.replace("#step-", "");
        const index = parseInt(indexStr, 10);
        if (!isNaN(index) && index >= 0) {
          // Atraso para garantir que o estado inicial do QuizFlow seja montado
          setTimeout(() => {
            jump(index);
            // Limpa o hash após o jump para evitar que ao recarregar ele tente pular de novo
            window.history.replaceState(null, "", window.location.pathname);
          }, 100);
        }
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange();

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [navigate, jump]);

  return <QuizFlow />;
}