import { ReactElement, cloneElement } from "react";
import html2Canvas from "html2canvas";
import js2PDF from "jspdf";

export default function ComponentDownloader({
  children,
  element_id,
  file_name,
}: {
  children: ReactElement;
  element_id: string;
  file_name: string;
}) {
  async function downloadPdf() {
    const element: HTMLElement = document.querySelector(
      `#${element_id}`
    ) as any;

    document?.querySelector("#logo")?.classList?.remove("hidden");

    const width = element.offsetWidth;
    const height = element.scrollHeight;

    const orientation = width > height ? "l" : "p";

    const canvas = await html2Canvas(element, {
      allowTaint: true,
      useCORS: true,
      height: element.scrollHeight + 40,
      windowHeight: element?.scrollHeight + 150,
    });

    const pdf = new js2PDF({ orientation, unit: "px" });

    const image = canvas.toDataURL("image/png");

    pdf.internal.pageSize.width = width;

    pdf.internal.pageSize.height = height;

    pdf.addImage(image, "JPEG", 0, 0, width, height);

    pdf.save(file_name + ".pdf");

    document?.querySelector("#logo")?.classList?.add("hidden");
  }
  return (
    <>
      {cloneElement(children, {
        onClick: () => (children?.props?.disabled ? false : downloadPdf()),
      })}
    </>
  );
}
