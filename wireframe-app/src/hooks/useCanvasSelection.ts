import { useCallback, useState } from "react";
import type { CanvasNode, PageData } from "../components/types";

type UpdateActivePage = (updater: (page: PageData) => PageData) => void;

// 選択状態と前後関係の操作をまとめるフック。
export default function useCanvasSelection(updateActivePage: UpdateActivePage) {
  const [tool, setTool] = useState<"select" | CanvasNode["type"]>("select");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const getSelectedNode = useCallback(
    (page: PageData | null) =>
      page?.nodes?.find((node) => node.id === selectedId) ?? null,
    [selectedId],
  );

  const clearSelection = useCallback(() => {
    setSelectedId(null);
  }, []);

  const handleDeleteSelected = useCallback(
    (activePage: PageData | null) => {
      if (!selectedId || !activePage) return;
      updateActivePage((page) => ({
        ...page,
        nodes: (page.nodes ?? []).filter((node) => node.id !== selectedId),
      }));
      setSelectedId(null);
    },
    [selectedId, updateActivePage],
  );

  const handleReorder = useCallback(
    (direction: "forward" | "backward", activePage: PageData | null) => {
      if (!selectedId || !activePage) return;
      updateActivePage((page) => {
        const nodes = page.nodes ?? [];
        const index = nodes.findIndex((node) => node.id === selectedId);
        if (index < 0) return page;
        const next = [...nodes];
        const newIndex =
          direction === "forward"
            ? Math.min(nodes.length - 1, index + 1)
            : Math.max(0, index - 1);
        const [item] = next.splice(index, 1);
        next.splice(newIndex, 0, item);
        return { ...page, nodes: next };
      });
    },
    [selectedId, updateActivePage],
  );

  const updateSelectedNode = useCallback(
    (updater: (node: CanvasNode) => CanvasNode) => {
      if (!selectedId) return;
      updateActivePage((page) => ({
        ...page,
        nodes: (page.nodes ?? []).map((node) =>
          node.id === selectedId ? updater(node) : node,
        ),
      }));
    },
    [selectedId, updateActivePage],
  );

  return {
    tool,
    setTool,
    selectedId,
    setSelectedId,
    getSelectedNode,
    clearSelection,
    handleDeleteSelected,
    handleReorder,
    updateSelectedNode,
  };
}
