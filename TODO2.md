# TODO - Correções de Bugs

## Tarefas

1.  **Bug Fix: Sidebar visível para usuários não logados**
    *   **Status:**  pendente
    *   **Descrição:** A sidebar com menus de navegação está sendo exibida em páginas públicas (login/registro), o que não deveria ocorrer.
    *   **Ação:** Ocultar a sidebar para usuários não autenticados. Apenas as páginas de `signin` e `signup` devem ser acessíveis.
    *   **Arquivos a serem modificados:** `src/core/layouts/AppLayout.tsx`, `src/middleware.ts`.

2.  **Bug Fix: Título da página dinâmico**
    *   **Status:** pendente
    *   **Descrição:** O título exibido no cabeçalho da aplicação está estático como "Dashboard", independentemente da página atual.
    *   **Ação:** Implementar lógica para que o título da página seja atualizado dinamicamente de acordo com a rota/menu atual.
    *   **Arquivos a serem modificados:** `src/core/layouts/AppLayout.tsx`.

3.  **Atualizar CHANGELOG.md**
    *   **Status:** pendente
    *   **Descrição:** Após a conclusão das correções, registrar as mudanças no arquivo `CHANGELOG.md`.
    *   **Ação:** Adicionar uma nova entrada na seção `[0.1.1] - 2025-07-23` (ou data atual) descrevendo as correções.
