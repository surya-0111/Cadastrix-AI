import svgPaths from "./svg-oe0eeqf4f1";
import imgMapBackgroundImage from "./388f51448251270a884bb555ee52377ebc32d563.png";

function Container() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#bac9cc] text-[12px] tracking-[0.6px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">PROJECTS</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[7px] relative shrink-0 w-[4.317px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="7" preserveAspectRatio="none" viewBox="0 0 4.31667 7" width="4.31667">
        <g id="Container">
          <path d={svgPaths.p35022f90} fill="#BAC9CC" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#c3f5ff] text-[12px] tracking-[0.6px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">URBAN SURVEY - CHENNAI</p>
      </div>
    </div>
  );
}

function BreadcrumbsPlaceholder() {
  return (
    <div className="relative shrink-0" data-name="Breadcrumbs Placeholder">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Container />
        <Container1 />
        <Container2 />
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#00e5ff] text-[12px] tracking-[0.6px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">AI ENGINE ONLINE</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Container">
      <div className="bg-[#00e5ff] relative rounded-[9999px] shadow-[0px_0px_8px_0px_rgba(0,229,255,0.8)] shrink-0 size-[8px]" data-name="Background+Shadow" />
      <Container5 />
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#0068ed] text-[12px] tracking-[0.6px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">GIS ENGINE ONLINE</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Container">
      <div className="bg-[#0068ed] relative rounded-[9999px] shrink-0 size-[8px]" data-name="Background" />
      <Container7 />
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex gap-[16.01px] items-center relative shrink-0" data-name="Container">
      <Container4 />
      <Container6 />
    </div>
  );
}

function Container8() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="18" preserveAspectRatio="none" viewBox="0 0 18 18" width="18">
        <g id="Container">
          <path d={svgPaths.p254c2600} fill="#BAC9CC" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(255,255,255,0.05)] opacity-80 relative rounded-[4px] shrink-0" data-name="Button">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-[5px] relative size-full">
        <Container8 />
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="relative shrink-0 size-[9.333px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="9.33333" preserveAspectRatio="none" viewBox="0 0 9.33333 9.33333" width="9.33333">
        <g id="Container">
          <path d={svgPaths.p6d5e700} fill="#D4E4FA" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function OverlayBorderOverlayBlur() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(255,255,255,0.05)] relative rounded-[9999px] shrink-0 size-[32px]" data-name="Overlay+Border+OverlayBlur">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-px relative size-full">
        <Container9 />
      </div>
    </div>
  );
}

function VerticalBorder() {
  return (
    <div className="content-stretch flex gap-[12px] items-center pl-[17px] relative shrink-0" data-name="VerticalBorder">
      <div aria-hidden className="absolute border-[rgba(255,255,255,0.1)] border-l border-solid inset-0 pointer-events-none" />
      <Button />
      <OverlayBorderOverlayBlur />
    </div>
  );
}

function RightActions() {
  return (
    <div className="relative shrink-0" data-name="Right Actions">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[24px] items-center relative size-full">
        <Container3 />
        <VerticalBorder />
      </div>
    </div>
  );
}

function HeaderTopnavbar() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(5,20,36,0.7)] h-[64px] relative shrink-0 w-full z-[2]" data-name="Header - TOPNAVBAR">
      <div aria-hidden className="absolute border-[rgba(255,255,255,0.1)] border-b border-solid inset-0 pointer-events-none shadow-[0px_1px_2px_0px_rgba(195,245,255,0.1)]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pb-px px-[16px] relative size-full">
          <BreadcrumbsPlaceholder />
          <RightActions />
        </div>
      </div>
    </div>
  );
}

function Heading1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Heading 2">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#d4e4fa] text-[32px] tracking-[-0.64px] whitespace-nowrap">
        <p className="leading-[40px]">Urban Survey - Chennai</p>
      </div>
    </div>
  );
}

function OverlayBorder() {
  return (
    <div className="bg-[rgba(0,104,237,0.2)] content-stretch flex gap-[8px] items-center px-[11px] py-[5px] relative rounded-[2px] shrink-0" data-name="Overlay+Border">
      <div aria-hidden className="absolute border border-[rgba(0,104,237,0.5)] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="bg-[#d9e2ff] relative rounded-[9999px] shrink-0 size-[6px]" data-name="Background" />
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#d9e2ff] text-[12px] tracking-[0.6px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">PROCESSING</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-name="Container">
      <Heading1 />
      <OverlayBorder />
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex flex-col items-start max-w-[672px] relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#bac9cc] text-[16px] whitespace-nowrap">
        <p className="leading-[24px] mb-0">Autonomous cadastral feature extraction and topological reconciliation</p>
        <p className="leading-[24px]">from georeferenced orthomosaics.</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0" data-name="Container">
      <Container11 />
      <Container12 />
    </div>
  );
}

function Container14() {
  return (
    <div className="relative shrink-0 size-[13.5px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="13.5" preserveAspectRatio="none" viewBox="0 0 13.5 13.5" width="13.5">
        <g id="Container">
          <path d={svgPaths.p34b74c80} fill="#D4E4FA" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(255,255,255,0.1)] content-stretch flex gap-[8px] items-center px-[17px] py-[9px] relative rounded-[4px] shrink-0" data-name="Button">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <Container14 />
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#d4e4fa] text-[12px] text-center tracking-[0.6px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">OPEN WEBGIS</p>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="h-[12px] relative shrink-0 w-[16.5px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="12" preserveAspectRatio="none" viewBox="0 0 16.5 12" width="16.5">
        <g id="Container">
          <path d={svgPaths.p22d8eb80} fill="white" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(195,245,255,0.2)] content-stretch flex gap-[8px] items-center px-[17px] py-[9px] relative rounded-[4px] shrink-0" data-name="Button">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="absolute bg-[rgba(255,255,255,0)] inset-[0_0.5px_0_0] rounded-[4px] shadow-[0px_4px_6px_-1px_rgba(195,245,255,0.2),0px_2px_4px_-2px_rgba(195,245,255,0.2)]" data-name="Button:shadow" />
      <Container15 />
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-center text-white tracking-[0.6px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">UPLOAD DRONE DATA</p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="Container">
      <Button1 />
      <Button2 />
    </div>
  );
}

function HeaderSection() {
  return (
    <div className="content-stretch flex items-end justify-between relative shrink-0 w-full" data-name="Header Section">
      <Container10 />
      <Container13 />
    </div>
  );
}

function Container16() {
  return (
    <div className="relative shrink-0 size-[10.5px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="10.5" preserveAspectRatio="none" viewBox="0 0 10.5 10.5" width="10.5">
        <g id="Container">
          <path d={svgPaths.p36dfb380} fill="#BAC9CC" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function OverlayBorderOverlayBlur1() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(18,33,49,0.6)] content-stretch flex gap-[8px] items-center px-[13px] py-[7px] relative rounded-[4px] shrink-0" data-name="Overlay+Border+OverlayBlur">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.05)] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <Container16 />
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#bac9cc] text-[12px] tracking-[0.6px] whitespace-nowrap">
        <p className="leading-[16px]">Orthorectified GeoTIFF</p>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="relative shrink-0 size-[11.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="11.6667" preserveAspectRatio="none" viewBox="0 0 11.6667 11.6667" width="11.6667">
        <g id="Container">
          <path d={svgPaths.p3c4dd880} fill="#BAC9CC" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function OverlayBorderOverlayBlur2() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(18,33,49,0.6)] content-stretch flex gap-[7.99px] items-center px-[13px] py-[7px] relative rounded-[4px] shrink-0" data-name="Overlay+Border+OverlayBlur">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.05)] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <Container17 />
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#bac9cc] text-[12px] tracking-[0.6px] whitespace-nowrap">
        <p className="leading-[16px]">EPSG:3857</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="relative shrink-0 size-[9.927px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="9.92685" preserveAspectRatio="none" viewBox="0 0 9.92685 9.92685" width="9.92685">
        <g id="Container">
          <path d={svgPaths.p2543bf96} fill="#BAC9CC" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function OverlayBorderOverlayBlur3() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(18,33,49,0.6)] content-stretch flex gap-[8px] items-center px-[13px] py-[7px] relative rounded-[4px] shrink-0" data-name="Overlay+Border+OverlayBlur">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.05)] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <Container18 />
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#bac9cc] text-[12px] tracking-[0.6px] whitespace-nowrap">
        <p className="leading-[16px]">18.42 km²</p>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="relative shrink-0 size-[10.5px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="10.5" preserveAspectRatio="none" viewBox="0 0 10.5 10.5" width="10.5">
        <g id="Container">
          <path d={svgPaths.p39c00280} fill="#BAC9CC" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function OverlayBorderOverlayBlur4() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(18,33,49,0.6)] content-stretch flex gap-[8px] items-center px-[13px] py-[7px] relative rounded-[4px] shrink-0" data-name="Overlay+Border+OverlayBlur">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.05)] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <Container19 />
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#bac9cc] text-[12px] tracking-[0.6px] whitespace-nowrap">
        <p className="leading-[16px]">5cm/pixel resolution</p>
      </div>
    </div>
  );
}

function SectionMetadataStrip() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Section - Metadata Strip">
      <OverlayBorderOverlayBlur1 />
      <OverlayBorderOverlayBlur2 />
      <OverlayBorderOverlayBlur3 />
      <OverlayBorderOverlayBlur4 />
    </div>
  );
}

function Container20() {
  return (
    <div className="h-[12px] relative shrink-0 w-[13.333px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="12" preserveAspectRatio="none" viewBox="0 0 13.3333 12" width="13.3333">
        <g id="Container">
          <path d={svgPaths.p316fe100} fill="#BAC9CC" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Heading2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Container20 />
        <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#bac9cc] text-[11px] tracking-[1.1px] uppercase whitespace-nowrap">
          <p className="leading-[16px]">EXTRACTION PIPELINE STATUS</p>
        </div>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="h-[8.017px] relative shrink-0 w-[10.867px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="8.01667" preserveAspectRatio="none" viewBox="0 0 10.8667 8.01667" width="10.8667">
        <g id="Container">
          <path d={svgPaths.p8c91f20} fill="#00E5FF" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function BackgroundBorderShadow() {
  return (
    <div className="bg-[#051424] content-stretch drop-shadow-[0px_0px_5px_rgba(0,229,255,0.2)] flex items-center justify-center p-[2px] relative rounded-[9999px] shrink-0 size-[32px]" data-name="Background+Border+Shadow">
      <div aria-hidden className="absolute border-2 border-[#00e5ff] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <Container22 />
    </div>
  );
}

function Component1Upload() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-center relative shrink-0 w-[96px]" data-name="1. Upload">
      <BackgroundBorderShadow />
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#d4e4fa] text-[12px] text-center tracking-[0.6px] whitespace-nowrap">
        <p className="leading-[16px]">Upload</p>
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="h-[8.017px] relative shrink-0 w-[10.867px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="8.01667" preserveAspectRatio="none" viewBox="0 0 10.8667 8.01667" width="10.8667">
        <g id="Container">
          <path d={svgPaths.p8c91f20} fill="#00E5FF" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function BackgroundBorderShadow1() {
  return (
    <div className="bg-[#051424] content-stretch drop-shadow-[0px_0px_5px_rgba(0,229,255,0.2)] flex items-center justify-center p-[2px] relative rounded-[9999px] shrink-0 size-[32px]" data-name="Background+Border+Shadow">
      <div aria-hidden className="absolute border-2 border-[#00e5ff] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <Container23 />
    </div>
  );
}

function Component2Preprocess() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-center relative shrink-0 w-[96px]" data-name="2. Preprocess">
      <BackgroundBorderShadow1 />
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#d4e4fa] text-[12px] text-center tracking-[0.6px] whitespace-nowrap">
        <p className="leading-[16px]">Preprocess</p>
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="h-[8.017px] relative shrink-0 w-[10.867px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="8.01667" preserveAspectRatio="none" viewBox="0 0 10.8667 8.01667" width="10.8667">
        <g id="Container">
          <path d={svgPaths.p8c91f20} fill="#00E5FF" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function BackgroundBorderShadow2() {
  return (
    <div className="bg-[#051424] content-stretch drop-shadow-[0px_0px_5px_rgba(0,229,255,0.2)] flex items-center justify-center p-[2px] relative rounded-[9999px] shrink-0 size-[32px]" data-name="Background+Border+Shadow">
      <div aria-hidden className="absolute border-2 border-[#00e5ff] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <Container24 />
    </div>
  );
}

function Container25() {
  return (
    <div className="content-stretch flex flex-col items-center pl-[12.89px] pr-[12.91px] relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#d4e4fa] text-[12px] text-center tracking-[0.6px] whitespace-nowrap">
        <p className="leading-[16px] mb-0">Building</p>
        <p className="leading-[16px]">Detection</p>
      </div>
    </div>
  );
}

function Component3BuildingDetection() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-center relative shrink-0 w-[96px]" data-name="3. Building Detection">
      <BackgroundBorderShadow2 />
      <Container25 />
    </div>
  );
}

function Container26() {
  return (
    <div className="h-[8.017px] relative shrink-0 w-[10.867px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="8.01667" preserveAspectRatio="none" viewBox="0 0 10.8667 8.01667" width="10.8667">
        <g id="Container">
          <path d={svgPaths.p8c91f20} fill="#00E5FF" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function BackgroundBorderShadow3() {
  return (
    <div className="bg-[#051424] content-stretch drop-shadow-[0px_0px_5px_rgba(0,229,255,0.2)] flex items-center justify-center p-[2px] relative rounded-[9999px] shrink-0 size-[32px]" data-name="Background+Border+Shadow">
      <div aria-hidden className="absolute border-2 border-[#00e5ff] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <Container26 />
    </div>
  );
}

function Container27() {
  return (
    <div className="content-stretch flex flex-col items-center pl-[12.89px] pr-[12.9px] relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#d4e4fa] text-[12px] text-center tracking-[0.6px] whitespace-nowrap">
        <p className="leading-[16px] mb-0">Road</p>
        <p className="leading-[16px]">Detection</p>
      </div>
    </div>
  );
}

function Component4RoadDetection() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-center relative shrink-0 w-[96px]" data-name="4. Road Detection">
      <BackgroundBorderShadow3 />
      <Container27 />
    </div>
  );
}

function Container28() {
  return (
    <div className="relative shrink-0 size-[10.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="10.6667" preserveAspectRatio="none" viewBox="0 0 10.6667 10.6667" width="10.6667">
        <g id="Container">
          <path d={svgPaths.p29641280} fill="#00626E" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function BackgroundBorder() {
  return (
    <div className="bg-[#00e5ff] content-stretch flex items-center justify-center p-[2px] relative rounded-[9999px] shrink-0 size-[32px]" data-name="Background+Border">
      <div aria-hidden className="absolute border-2 border-[#00e5ff] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <Container28 />
    </div>
  );
}

function BackgroundBorder1() {
  return (
    <div className="absolute bg-[#273647] bottom-[-16px] content-stretch flex flex-col items-start left-[29.98px] px-[9px] py-[3px] rounded-[4px]" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="absolute bg-[rgba(255,255,255,0)] inset-0 rounded-[4px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]" data-name="Overlay+Shadow" />
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Mono:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#00e5ff] text-[10px] whitespace-nowrap">
        <p className="leading-[15px]">42%</p>
      </div>
    </div>
  );
}

function Component5ParcelReconstructionActive() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-center relative shrink-0 w-[96px]" data-name="5. Parcel Reconstruction (ACTIVE)">
      <BackgroundBorder />
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#00e5ff] text-[12px] text-center tracking-[0.6px] whitespace-nowrap">
        <p className="leading-[16px]">Parcel Recon</p>
      </div>
      <BackgroundBorder1 />
    </div>
  );
}

function Container29() {
  return (
    <div className="h-[12px] relative shrink-0 w-[13.333px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="12" preserveAspectRatio="none" viewBox="0 0 13.3333 12" width="13.3333">
        <g id="Container">
          <path d={svgPaths.p1df81cc0} fill="#849396" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function BackgroundBorder2() {
  return (
    <div className="bg-[#051424] content-stretch flex items-center justify-center p-[2px] relative rounded-[9999px] shrink-0 size-[32px]" data-name="Background+Border">
      <div aria-hidden className="absolute border-2 border-[#3b494c] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <Container29 />
    </div>
  );
}

function Container30() {
  return (
    <div className="content-stretch flex flex-col items-center pl-[8.99px] pr-[9px] relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#bac9cc] text-[12px] text-center tracking-[0.6px] whitespace-nowrap">
        <p className="leading-[16px] mb-0">Topology</p>
        <p className="leading-[16px]">Validation</p>
      </div>
    </div>
  );
}

function Component6TopologyValidation() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-center opacity-50 relative shrink-0 w-[96px]" data-name="6. Topology Validation">
      <BackgroundBorder2 />
      <Container30 />
    </div>
  );
}

function Container31() {
  return (
    <div className="h-[10.667px] relative shrink-0 w-[14.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="10.6667" preserveAspectRatio="none" viewBox="0 0 14.6667 10.6667" width="14.6667">
        <g id="Container">
          <path d={svgPaths.p45c1540} fill="#849396" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function BackgroundBorder3() {
  return (
    <div className="bg-[#051424] content-stretch flex items-center justify-center p-[2px] relative rounded-[9999px] shrink-0 size-[32px]" data-name="Background+Border">
      <div aria-hidden className="absolute border-2 border-[#3b494c] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <Container31 />
    </div>
  );
}

function Component7HumanReview() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-center opacity-50 relative shrink-0 w-[96px]" data-name="7. Human Review">
      <BackgroundBorder3 />
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#bac9cc] text-[12px] text-center tracking-[0.6px] whitespace-nowrap">
        <p className="leading-[16px]">Human Review</p>
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="relative shrink-0 size-[10.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="10.6667" preserveAspectRatio="none" viewBox="0 0 10.6667 10.6667" width="10.6667">
        <g id="Container">
          <path d={svgPaths.p358da480} fill="#849396" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function BackgroundBorder4() {
  return (
    <div className="bg-[#051424] content-stretch flex items-center justify-center p-[2px] relative rounded-[9999px] shrink-0 size-[32px]" data-name="Background+Border">
      <div aria-hidden className="absolute border-2 border-[#3b494c] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <Container32 />
    </div>
  );
}

function Component8Export() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-center opacity-50 relative shrink-0 w-[96px]" data-name="8. Export">
      <BackgroundBorder4 />
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#bac9cc] text-[12px] text-center tracking-[0.6px] whitespace-nowrap">
        <p className="leading-[16px]">Export</p>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pb-[32px] relative size-full">
        <div className="absolute bg-[#273647] h-[2px] left-0 right-0 top-[15px]" data-name="Connecting Background Line" />
        <div className="absolute bg-[#00e5ff] h-[2px] left-0 right-[43%] shadow-[0px_0px_8px_0px_rgba(0,229,255,0.5)] top-[15px]" data-name="Connecting Progress Line (Up to step 4)" />
        <Component1Upload />
        <Component2Preprocess />
        <Component3BuildingDetection />
        <Component4RoadDetection />
        <Component5ParcelReconstructionActive />
        <Component6TopologyValidation />
        <Component7HumanReview />
        <Component8Export />
      </div>
    </div>
  );
}

function SectionWorkflowTimelineCritical() {
  return (
    <div className="backdrop-blur-[12px] bg-[rgba(5,20,36,0.6)] relative rounded-[12px] shrink-0 w-full" data-name="Section - WORKFLOW TIMELINE (CRITICAL)">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col gap-[24px] items-start p-[25px] relative size-full">
        <div className="absolute bg-[rgba(255,255,255,0)] inset-0 rounded-[12px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.2),0px_4px_6px_-4px_rgba(0,0,0,0.2)]" data-name="Section - WORKFLOW TIMELINE (CRITICAL):shadow" />
        <Heading2 />
        <Container21 />
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#bac9cc] text-[12px] tracking-[0.6px] w-full">
          <p className="leading-[16px] mb-0">Feature</p>
          <p className="leading-[16px]">Inventory</p>
        </div>
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#d4e4fa] text-[24px] tracking-[-0.24px] w-full">
          <p className="leading-[32px]">127</p>
        </div>
      </div>
    </div>
  );
}

function Metric() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(5,20,36,0.5)] flex-[1_0_0] min-w-px relative rounded-[8px]" data-name="Metric 1">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.05)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col gap-[4px] items-start p-[17px] relative size-full">
        <Container33 />
        <Container34 />
      </div>
    </div>
  );
}

function Container35() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#bac9cc] text-[12px] tracking-[0.6px] w-full">
          <p className="leading-[16px] mb-0">Validated</p>
          <p className="leading-[16px]">Features</p>
        </div>
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#b0c6ff] text-[24px] tracking-[-0.24px] w-full">
          <p className="leading-[32px]">121</p>
        </div>
      </div>
    </div>
  );
}

function Metric1() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(5,20,36,0.5)] flex-[1_0_0] min-w-px relative rounded-[8px]" data-name="Metric 2">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.05)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col gap-[4px] items-start p-[17px] relative size-full">
        <Container35 />
        <Container36 />
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#bac9cc] text-[12px] tracking-[0.6px] w-full">
          <p className="leading-[16px] mb-0">Topological</p>
          <p className="leading-[16px]">Repairs</p>
        </div>
      </div>
    </div>
  );
}

function Container38() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#d4e4fa] text-[24px] tracking-[-0.24px] w-full">
          <p className="leading-[32px]">4</p>
        </div>
      </div>
    </div>
  );
}

function Metric2() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(5,20,36,0.5)] flex-[1_0_0] min-w-px relative rounded-[8px]" data-name="Metric 3">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.05)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col gap-[4px] items-start p-[17px] relative size-full">
        <Container37 />
        <Container38 />
      </div>
    </div>
  );
}

function Container39() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#bac9cc] text-[12px] tracking-[0.6px] w-full">
          <p className="leading-[16px] mb-0">Manual</p>
          <p className="leading-[16px]">Verification</p>
        </div>
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#ffb4ab] text-[24px] tracking-[-0.24px] w-full">
          <p className="leading-[32px]">2</p>
        </div>
      </div>
    </div>
  );
}

function Metric3() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(5,20,36,0.5)] flex-[1_0_0] min-w-px relative rounded-[8px]" data-name="Metric 4">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.05)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col gap-[4px] items-start p-[17px] relative size-full">
        <Container39 />
        <Container40 />
      </div>
    </div>
  );
}

function Container41() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#bac9cc] text-[12px] tracking-[0.6px] w-full">
          <p className="leading-[16px]">Buildings</p>
        </div>
      </div>
    </div>
  );
}

function Container42() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#d4e4fa] text-[24px] tracking-[-0.24px] w-full">
          <p className="leading-[32px]">1,284</p>
        </div>
      </div>
    </div>
  );
}

function Metric4() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(5,20,36,0.5)] flex-[1_0_0] min-w-px relative rounded-[8px]" data-name="Metric 5">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.05)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col gap-[4px] items-start pb-[33px] pt-[17px] px-[17px] relative size-full">
        <Container41 />
        <Container42 />
      </div>
    </div>
  );
}

function Container43() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#bac9cc] text-[12px] tracking-[0.6px] w-full">
          <p className="leading-[16px] mb-0">Road</p>
          <p className="leading-[16px]">Segments</p>
        </div>
      </div>
    </div>
  );
}

function Container44() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#d4e4fa] text-[24px] tracking-[-0.24px] w-full">
          <p className="leading-[32px]">842</p>
        </div>
      </div>
    </div>
  );
}

function Metric5() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(5,20,36,0.5)] flex-[1_0_0] min-w-px relative rounded-[8px]" data-name="Metric 6">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.05)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col gap-[4px] items-start p-[17px] relative size-full">
        <Container43 />
        <Container44 />
      </div>
    </div>
  );
}

function Container45() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#bac9cc] text-[12px] tracking-[0.6px] w-full">
          <p className="leading-[16px] mb-0">Statistical</p>
          <p className="leading-[16px]">Confidence</p>
        </div>
      </div>
    </div>
  );
}

function Container46() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#00e5ff] text-[24px] tracking-[-0.24px] w-full">
          <p className="leading-[32px]">92.8%</p>
        </div>
      </div>
    </div>
  );
}

function Metric6() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(5,20,36,0.5)] flex-[1_0_0] min-w-px relative rounded-[8px]" data-name="Metric 7">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.05)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col gap-[4px] items-start p-[17px] relative size-full">
        <Container45 />
        <Container46 />
      </div>
    </div>
  );
}

function Container47() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#bac9cc] text-[12px] tracking-[0.6px] w-full">
          <p className="leading-[16px] mb-0">Processing</p>
          <p className="leading-[16px]">Duration</p>
        </div>
      </div>
    </div>
  );
}

function Container48() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#d4e4fa] text-[24px] tracking-[-0.24px] w-full">
          <p className="leading-[32px]">08:42</p>
        </div>
      </div>
    </div>
  );
}

function Metric7() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(5,20,36,0.5)] flex-[1_0_0] min-w-px relative rounded-[8px]" data-name="Metric 8">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.05)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col gap-[4px] items-start p-[17px] relative size-full">
        <Container47 />
        <Container48 />
      </div>
    </div>
  );
}

function SectionMetricsStripBentoGrid() {
  return (
    <div className="content-stretch flex gap-[12px] items-start justify-center relative shrink-0 w-full" data-name="Section - METRICS STRIP (Bento Grid)">
      <Metric />
      <Metric1 />
      <Metric2 />
      <Metric3 />
      <Metric4 />
      <Metric5 />
      <Metric6 />
      <Metric7 />
    </div>
  );
}

function Container50() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#00e5ff] text-[12px] tracking-[0.6px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">LIVE STREAM</p>
      </div>
    </div>
  );
}

function Container49() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center pr-[192.19px] relative size-full">
        <div className="bg-[#00e5ff] relative rounded-[9999px] shrink-0 size-[8px]" data-name="Background" />
        <Container50 />
      </div>
    </div>
  );
}

function FloatingHudElementsOnMap() {
  return (
    <div className="absolute backdrop-blur-[6px] bg-[rgba(5,20,36,0.8)] content-stretch flex flex-col gap-[7.5px] items-start left-[17px] max-w-[320px] p-[13px] rounded-[4px] top-[17px]" data-name="Floating HUD Elements on Map">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="absolute bg-[rgba(255,255,255,0)] inset-[0_0_-0.5px_0] rounded-[4px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]" data-name="Floating HUD Elements on Map:shadow" />
      <Container49 />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#bac9cc] text-[14px] whitespace-nowrap">
        <p className="leading-[20px] mb-0">Extracting vector geometry from tile sector</p>
        <p className="leading-[20px]">Alpha-9. Tensor processing active.</p>
      </div>
    </div>
  );
}

function Container52() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#bac9cc] text-[12px] text-right tracking-[0.6px] whitespace-nowrap">
        <p className="leading-[16px]">LAT</p>
      </div>
    </div>
  );
}

function Container53() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#d4e4fa] text-[12px] text-right tracking-[0.6px] whitespace-nowrap">
        <p className="leading-[16px]">13.0827 N</p>
      </div>
    </div>
  );
}

function Container51() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container52 />
        <Container53 />
      </div>
    </div>
  );
}

function Container55() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#bac9cc] text-[12px] tracking-[0.6px] whitespace-nowrap">
        <p className="leading-[16px]">LON</p>
      </div>
    </div>
  );
}

function Container56() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#d4e4fa] text-[12px] tracking-[0.6px] whitespace-nowrap">
        <p className="leading-[16px]">80.2707 E</p>
      </div>
    </div>
  );
}

function Container54() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container55 />
        <Container56 />
      </div>
    </div>
  );
}

function OverlayBorderOverlayBlur5() {
  return (
    <div className="absolute backdrop-blur-[6px] bg-[rgba(5,20,36,0.8)] bottom-[17px] content-stretch flex gap-[16px] items-center p-[9px] right-[17px] rounded-[4px]" data-name="Overlay+Border+OverlayBlur">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <Container51 />
      <div className="bg-[rgba(255,255,255,0.1)] h-[32px] relative shrink-0 w-px" data-name="Vertical Divider" />
      <Container54 />
    </div>
  );
}

function CrosshairOverlayAtmospheric() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute content-stretch flex items-center justify-center left-1/2 p-px rounded-[9999px] size-[128px] top-1/2" data-name="Crosshair overlay (Atmospheric)">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.05)] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <div className="bg-[#00e5ff] relative rounded-[9999px] shrink-0 size-[4px]" data-name="Background" />
      <div className="absolute bg-[rgba(0,229,255,0.3)] h-[16px] left-[62px] top-px w-[4px]" data-name="Overlay" />
      <div className="absolute bg-[rgba(0,229,255,0.3)] bottom-px h-[16px] left-[62px] w-[4px]" data-name="Overlay" />
      <div className="absolute bg-[rgba(0,229,255,0.3)] h-[4px] left-px top-[62px] w-[16px]" data-name="Overlay" />
      <div className="absolute bg-[rgba(0,229,255,0.3)] h-[4px] right-px top-[62px] w-[16px]" data-name="Overlay" />
    </div>
  );
}

function SectionMapVisualAreaPlaceholder() {
  return (
    <div className="bg-[#122131] h-[400px] min-h-[400px] relative rounded-[12px] shrink-0 w-full" data-name="Section - Map Visual Area Placeholder">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <div className="absolute inset-px mix-blend-luminosity opacity-40" data-name="Map Background Image">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img alt="" className="absolute h-[228.64%] left-0 max-w-none top-[-64.32%] w-full" src={imgMapBackgroundImage} />
          </div>
        </div>
        <div className="absolute bg-gradient-to-t from-[#051424] inset-px to-[rgba(5,20,36,0)] via-1/2 via-[rgba(5,20,36,0)]" data-name="Overlay Gradients for Depth" />
        <div className="absolute inset-px pointer-events-none" data-name="Overlay+Shadow">
          <div aria-hidden className="absolute bg-[rgba(255,255,255,0)] inset-0" />
          <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0px_0px_40px_0px_rgba(0,0,0,0.8)]" />
        </div>
        <FloatingHudElementsOnMap />
        <OverlayBorderOverlayBlur5 />
        <CrosshairOverlayAtmospheric />
      </div>
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function MainDashboardCanvas() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full z-[1]" data-name="Main - DASHBOARD CANVAS">
      <div className="overflow-auto rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[24px] items-start p-[24px] relative size-full">
          <HeaderSection />
          <SectionMetadataStrip />
          <SectionWorkflowTimelineCritical />
          <SectionMetricsStripBentoGrid />
          <SectionMapVisualAreaPlaceholder />
        </div>
      </div>
    </div>
  );
}

function MainContentWrapper() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-full isolate items-start min-h-[1032px] min-w-px relative" style={{ backgroundImage: "linear-gradient(90deg, rgba(255, 255, 255, 0.03) 3.125%, rgba(255, 255, 255, 0) 3.125%), linear-gradient(180deg, rgba(255, 255, 255, 0.03) 3.125%, rgba(255, 255, 255, 0) 3.125%)" }} data-name="Main Content Wrapper">
      <HeaderTopnavbar />
      <MainDashboardCanvas />
    </div>
  );
}

function Container57() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 20 20" width="20">
        <g id="Container">
          <path d={svgPaths.p33ced450} fill="#00E5FF" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function BackgroundBorder5() {
  return (
    <div className="bg-[#2c3a4c] relative rounded-[9999px] shrink-0 size-[40px]" data-name="Background+Border">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center overflow-clip p-px relative rounded-[inherit] size-full">
        <Container57 />
      </div>
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[9999px]" />
    </div>
  );
}

function Heading() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 1">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#00e5ff] text-[24px] tracking-[-1.2px] whitespace-nowrap">
        <p className="leading-[32px]">CadastraAI</p>
      </div>
    </div>
  );
}

function Container59() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#bac9cc] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">GIS Command Center</p>
      </div>
    </div>
  );
}

function Container58() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Heading />
        <Container59 />
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="relative shrink-0 w-full" data-name="Header">
      <div aria-hidden className="absolute border-[rgba(255,255,255,0.05)] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center pb-[25px] pt-[24px] px-[24px] relative size-full">
          <BackgroundBorder5 />
          <Container58 />
        </div>
      </div>
    </div>
  );
}

function Container60() {
  return (
    <div className="h-[16px] relative shrink-0 w-[21.5px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 21.5 16" width="21.5">
        <g id="Container">
          <path d={svgPaths.p1c4e6080} fill="#00E5FF" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container61() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#00e5ff] text-[16px] whitespace-nowrap">
          <p className="leading-[24px]">Projects</p>
        </div>
      </div>
    </div>
  );
}

function LinkActiveTabProjects() {
  return (
    <div className="flex h-[49px] items-center justify-center relative shrink-0 w-[289.1px]">
      <div className="flex-none scale-x-98 scale-y-98">
        <div className="backdrop-blur-[6px] bg-[rgba(0,229,255,0.05)] content-stretch flex gap-[12px] items-center pl-[17px] pr-[18px] py-[13px] relative rounded-[8px] w-[295px]" data-name="Link - Active Tab: Projects">
          <div aria-hidden className="absolute border-[rgba(255,255,255,0.1)] border-b border-l border-r-2 border-solid border-t inset-0 pointer-events-none rounded-[8px]" />
          <Container60 />
          <Container61 />
        </div>
      </div>
    </div>
  );
}

function Container62() {
  return (
    <div className="h-[20px] relative shrink-0 w-[19.012px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 19.0118 20" width="19.0118">
        <g id="Container">
          <path d={svgPaths.p1f8cb380} fill="#BAC9CC" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container63() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#bac9cc] text-[16px] whitespace-nowrap">
          <p className="leading-[24px]">AI Processing</p>
        </div>
      </div>
    </div>
  );
}

function Link() {
  return (
    <div className="backdrop-blur-[6px] relative rounded-[8px] shrink-0 w-full" data-name="Link">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[17px] py-[13px] relative size-full">
          <Container62 />
          <Container63 />
        </div>
      </div>
    </div>
  );
}

function Container64() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="18" preserveAspectRatio="none" viewBox="0 0 18 18" width="18">
        <g id="Container">
          <path d={svgPaths.p1f25e00} fill="#BAC9CC" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container65() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#bac9cc] text-[16px] whitespace-nowrap">
          <p className="leading-[24px]">WebGIS</p>
        </div>
      </div>
    </div>
  );
}

function Link1() {
  return (
    <div className="backdrop-blur-[6px] relative rounded-[8px] shrink-0 w-full" data-name="Link">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[17px] py-[13px] relative size-full">
          <Container64 />
          <Container65 />
        </div>
      </div>
    </div>
  );
}

function Container66() {
  return (
    <div className="h-[18px] relative shrink-0 w-[20px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="18" preserveAspectRatio="none" viewBox="0 0 20 18" width="20">
        <g id="Container">
          <path d={svgPaths.p9c26380} fill="#BAC9CC" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container67() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#bac9cc] text-[16px] whitespace-nowrap">
          <p className="leading-[24px]">Validation</p>
        </div>
      </div>
    </div>
  );
}

function Link2() {
  return (
    <div className="backdrop-blur-[6px] relative rounded-[8px] shrink-0 w-full" data-name="Link">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[17px] py-[13px] relative size-full">
          <Container66 />
          <Container67 />
        </div>
      </div>
    </div>
  );
}

function Container68() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="18" preserveAspectRatio="none" viewBox="0 0 18 18" width="18">
        <g id="Container">
          <path d={svgPaths.p186f5ba0} fill="#BAC9CC" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container69() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#bac9cc] text-[16px] whitespace-nowrap">
          <p className="leading-[24px]">Parcels</p>
        </div>
      </div>
    </div>
  );
}

function Link3() {
  return (
    <div className="backdrop-blur-[6px] relative rounded-[8px] shrink-0 w-full" data-name="Link">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[17px] py-[13px] relative size-full">
          <Container68 />
          <Container69 />
        </div>
      </div>
    </div>
  );
}

function Container70() {
  return (
    <div className="h-[21px] relative shrink-0 w-[16px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="21" preserveAspectRatio="none" viewBox="0 0 16 21" width="16">
        <g id="Container">
          <path d={svgPaths.p394dd500} fill="#BAC9CC" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container71() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#bac9cc] text-[16px] whitespace-nowrap">
          <p className="leading-[24px]">Exports</p>
        </div>
      </div>
    </div>
  );
}

function Link4() {
  return (
    <div className="backdrop-blur-[6px] relative rounded-[8px] shrink-0 w-full" data-name="Link">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[17px] py-[13px] relative size-full">
          <Container70 />
          <Container71 />
        </div>
      </div>
    </div>
  );
}

function Container72() {
  return (
    <div className="h-[18px] relative shrink-0 w-[20px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="18" preserveAspectRatio="none" viewBox="0 0 20 18" width="20">
        <g id="Container">
          <path d={svgPaths.p3c508c40} fill="#BAC9CC" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container73() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#bac9cc] text-[16px] whitespace-nowrap">
          <p className="leading-[24px]">Analytics</p>
        </div>
      </div>
    </div>
  );
}

function Link5() {
  return (
    <div className="backdrop-blur-[6px] relative rounded-[8px] shrink-0 w-full" data-name="Link">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[17px] py-[13px] relative size-full">
          <Container72 />
          <Container73 />
        </div>
      </div>
    </div>
  );
}

function NavigationTabs() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="Navigation Tabs">
      <div className="flex flex-col items-center overflow-auto rounded-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-center px-[12px] py-[16px] relative size-full">
          <LinkActiveTabProjects />
          <Link />
          <Link1 />
          <Link2 />
          <Link3 />
          <Link4 />
          <Link5 />
        </div>
      </div>
    </div>
  );
}

function Container74() {
  return (
    <div className="h-[20px] relative shrink-0 w-[20.1px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 20.1 20" width="20.1">
        <g id="Container">
          <path d={svgPaths.p3cdadd00} fill="#BAC9CC" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container75() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#bac9cc] text-[16px] whitespace-nowrap">
          <p className="leading-[24px]">Settings</p>
        </div>
      </div>
    </div>
  );
}

function Link6() {
  return (
    <div className="backdrop-blur-[6px] relative rounded-[8px] shrink-0 w-full" data-name="Link">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.05)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center px-[17px] py-[13px] relative size-full">
          <Container74 />
          <Container75 />
        </div>
      </div>
    </div>
  );
}

function Container76() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 20 20" width="20">
        <g id="Container">
          <path d={svgPaths.p2816f2c0} fill="#BAC9CC" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container77() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#bac9cc] text-[16px] whitespace-nowrap">
          <p className="leading-[24px]">Help</p>
        </div>
      </div>
    </div>
  );
}

function Link7() {
  return (
    <div className="backdrop-blur-[6px] relative rounded-[8px] shrink-0 w-full" data-name="Link">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.05)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center px-[17px] py-[13px] relative size-full">
          <Container76 />
          <Container77 />
        </div>
      </div>
    </div>
  );
}

function FooterLinks() {
  return (
    <div className="relative shrink-0 w-full" data-name="Footer Links">
      <div aria-hidden className="absolute border-[rgba(255,255,255,0.05)] border-solid border-t inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start pb-[12px] pt-[13px] px-[12px] relative size-full">
        <Link6 />
        <Link7 />
      </div>
    </div>
  );
}

function NavSidenavbar() {
  return (
    <div className="absolute backdrop-blur-[12px] bg-[rgba(5,20,36,0.8)] content-stretch flex flex-col h-[1032px] items-start left-0 pr-px top-0 w-[320px]" data-name="Nav - SIDENAVBAR">
      <div aria-hidden className="absolute border-[rgba(59,73,76,0.2)] border-r border-solid inset-0 pointer-events-none" />
      <Header />
      <NavigationTabs />
      <FooterLinks />
    </div>
  );
}

export default function CadastraAiInteractiveProjectDashboard() {
  return (
    <div className="content-stretch flex items-start justify-center pl-[320px] relative size-full" style={{ backgroundImage: "linear-gradient(90deg, rgb(5, 20, 36) 0%, rgb(5, 20, 36) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }} data-name="CadastraAI - Interactive Project Dashboard">
      <MainContentWrapper />
      <NavSidenavbar />
    </div>
  );
}