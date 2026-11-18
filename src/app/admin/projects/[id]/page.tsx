import PortfolioEdit from "../../PortfolioEdit";

export default async function ProjectsEdit({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PortfolioEdit id={id} kind="project" />;
}
