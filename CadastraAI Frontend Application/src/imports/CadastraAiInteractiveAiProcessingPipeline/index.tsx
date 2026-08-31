import svgPaths from "./svg-ja4p9jc6st";
import imgUserAvatar from "./965779b79540489eb0c727c3c229faa3baaf6392.png";
import imgImageContainerWithGridOverlay from "./aa8a0a68bcfd56b4066181ea1a3b3a113f9d7e2e.png";
import imgMapBackgroundLevel0 from "./35de9acaa11fe8e20659f9dafc97f7921078ca12.png";

function Container1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#bac9cc] text-[12px] tracking-[0.6px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">AI PROCESSING</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[7px] relative shrink-0 w-[4.317px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="7" preserveAspectRatio="none" viewBox="0 0 4.31667 7" width="4.31667">
        <g id="Container">
          <path d={svgPaths.p35022f90} fill="#849396" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#c3f5ff] text-[12px] tracking-[0.6px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">EXTRACTING PHYSICAL FEATURES</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Container1 />
        <Container2 />
        <Container3 />
      </div>
    </div>
  );
}

function OverlayBorderOverlayBlur() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(0,229,255,0.1)] content-stretch flex gap-[4px] items-center px-[9px] py-[5px] relative rounded-[4px] shrink-0" data-name="Overlay+Border+OverlayBlur">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="bg-[#00e5ff] relative rounded-[9999px] shrink-0 size-[8px]" data-name="Background" />
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#00e5ff] text-[12px] tracking-[0.6px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">AI ENGINE ONLINE</p>
      </div>
    </div>
  );
}

function OverlayBorderOverlayBlur1() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(176,198,255,0.1)] content-stretch flex gap-[4px] items-center px-[9px] py-[5px] relative rounded-[4px] shrink-0" data-name="Overlay+Border+OverlayBlur">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="bg-[#b0c6ff] relative rounded-[9999px] shrink-0 size-[8px]" data-name="Background" />
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#b0c6ff] text-[12px] tracking-[0.6px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">GIS ENGINE ONLINE</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="Container">
      <OverlayBorderOverlayBlur />
      <OverlayBorderOverlayBlur1 />
    </div>
  );
}

function Container6() {
  return (
    <div className="relative shrink-0 size-[13.5px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="13.5" preserveAspectRatio="none" viewBox="0 0 13.5 13.5" width="13.5">
        <g id="Container">
          <path d={svgPaths.p1387a000} fill="#BAC9CC" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(255,255,255,0.05)] content-stretch flex items-center justify-center p-px relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[4px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
      <Container6 />
    </div>
  );
}

function UserAvatar() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="User Avatar">
      <div className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgUserAvatar} />
      </div>
    </div>
  );
}

function BackgroundBorder() {
  return (
    <div className="bg-[#122131] opacity-80 relative rounded-[9999px] shrink-0 size-[32px]" data-name="Background+Border">
      <div className="content-stretch flex flex-col items-start justify-center overflow-clip p-px relative rounded-[inherit] size-full">
        <UserAvatar />
      </div>
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[9999px]" />
    </div>
  );
}

function Container4() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative size-full">
        <Container5 />
        <Button />
        <BackgroundBorder />
      </div>
    </div>
  );
}

function HeaderTopNavBarSharedComponent() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(5,20,36,0.7)] h-[64px] relative shrink-0 w-full z-[3]" data-name="Header - TopNavBar (Shared Component)">
      <div aria-hidden className="absolute border-[rgba(255,255,255,0.1)] border-b border-solid inset-0 pointer-events-none shadow-[0px_1px_2px_0px_rgba(195,245,255,0.1)]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pb-px px-[16px] relative size-full">
          <Container />
          <Container4 />
        </div>
      </div>
    </div>
  );
}

function Heading1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 2">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#d4e4fa] text-[20px] whitespace-nowrap">
        <p className="leading-[28px]">Feature Extraction Engine: Active Pipeline</p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#bac9cc] text-[12px] tracking-[1.2px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">{`JOB ID: X-7794-B // REGION: SECTOR 4`}</p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0" data-name="Container">
      <Heading1 />
      <Container8 />
    </div>
  );
}

function Container9() {
  return (
    <div className="relative shrink-0 size-[11.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="11.6667" preserveAspectRatio="none" viewBox="0 0 11.6667 11.6667" width="11.6667">
        <g id="Container">
          <path d={svgPaths.p927f580} fill="#FFB4AB" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(255,255,255,0.05)] content-stretch flex gap-[7.99px] items-center px-[17px] py-[9px] relative rounded-[8px] shrink-0" data-name="Button">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
      <Container9 />
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#ffb4ab] text-[12px] text-center tracking-[0.6px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">ABORT PROCESS</p>
      </div>
    </div>
  );
}

function PageTitleArea() {
  return (
    <div className="relative shrink-0 w-full" data-name="Page Title Area">
      <div className="flex flex-row items-end size-full">
        <div className="content-stretch flex items-end justify-between relative size-full">
          <Container7 />
          <Button1 />
        </div>
      </div>
    </div>
  );
}

function PageTitleAreaMargin() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[12px] relative shrink-0 w-full" data-name="Page Title Area:margin">
      <PageTitleArea />
    </div>
  );
}

function Container10() {
  return (
    <div className="relative shrink-0 size-[10.5px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="10.5" preserveAspectRatio="none" viewBox="0 0 10.5 10.5" width="10.5">
        <g id="Container">
          <path d={svgPaths.p36dfb380} fill="#849396" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Heading2() {
  return (
    <div className="relative shrink-0" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Container10 />
        <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#d4e4fa] text-[12px] tracking-[0.6px] uppercase whitespace-nowrap">
          <p className="leading-[16px]">SOURCE IMAGERY</p>
        </div>
      </div>
    </div>
  );
}

function OverlayBlur() {
  return (
    <div className="backdrop-blur-[6px] relative shrink-0" data-name="OverlayBlur">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#bac9cc] text-[12px] tracking-[0.6px] whitespace-nowrap">
          <p className="leading-[16px]">Tiled GeoTIFF</p>
        </div>
      </div>
    </div>
  );
}

function OverlayHorizontalBorder() {
  return (
    <div className="bg-[rgba(5,20,36,0.5)] relative shrink-0 w-full z-[2]" data-name="Overlay+HorizontalBorder">
      <div aria-hidden className="absolute border-[rgba(255,255,255,0.1)] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pb-[13px] pt-[12px] px-[12px] relative size-full">
          <Heading2 />
          <OverlayBlur />
        </div>
      </div>
    </div>
  );
}

function Image() {
  return (
    <div className="relative shrink-0 size-[40px]" data-name="image">
      <svg className="absolute block inset-0 size-full" fill="none" height="40" preserveAspectRatio="none" viewBox="0 0 40 40" width="40">
        <g clipPath="url(#clip0_0_14)" id="image">
          <path d="M0 0H40V40H0V0V0" id="Vector" stroke="white" strokeOpacity="0.05" />
        </g>
        <defs>
          <clipPath id="clip0_0_14">
            <rect fill="white" height="40" width="40" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function HudElementsOverImage() {
  return (
    <div className="absolute content-stretch flex flex-col inset-0 items-start opacity-50 overflow-clip" data-name="HUD Elements over image">
      <Image />
    </div>
  );
}

function BackgroundBorder1() {
  return (
    <div className="absolute bg-[#051424] content-stretch flex flex-col items-start left-0 px-[5px] py-px top-[-20.5px]" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[rgba(0,229,255,0.3)] border-solid inset-0 pointer-events-none" />
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#00e5ff] text-[10px] whitespace-nowrap">
        <p className="leading-[20px]">TILE_42</p>
      </div>
    </div>
  );
}

function ActiveTileHighlight() {
  return (
    <div className="absolute bg-[rgba(0,229,255,0.1)] border border-[#00e5ff] border-solid bottom-1/2 left-[33.33%] right-[41.67%] top-1/4" data-name="Active Tile Highlight">
      <BackgroundBorder1 />
    </div>
  );
}

function Overlay() {
  return (
    <div className="bg-[rgba(0,0,0,0.5)] flex-[1_0_0] min-h-px relative w-full z-[1]" data-name="Overlay">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <div className="absolute bg-size-[512px_279px] bg-top-left inset-0" style={{ backgroundImage: `url("${imgImageContainerWithGridOverlay}")` }} data-name="Image Container with Grid Overlay" />
        <HudElementsOverImage />
        <div className="absolute bg-[#00e5ff] h-[2px] left-0 right-0 shadow-[0px_0px_8px_0px_rgba(0,229,255,0.8)] top-0" data-name="Scanning line animation" />
        <ActiveTileHighlight />
      </div>
    </div>
  );
}

function LeftSourceImagery() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(13,28,45,0.8)] h-full relative rounded-[12px] shrink-0 w-[301.33px]" data-name="Left: Source Imagery">
      <div className="content-stretch flex flex-col isolate items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <OverlayHorizontalBorder />
        <Overlay />
      </div>
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function Container11() {
  return (
    <div className="h-[10.5px] relative shrink-0 w-[11.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="10.5" preserveAspectRatio="none" viewBox="0 0 11.6667 10.5" width="11.6667">
        <g id="Container">
          <path d={svgPaths.p3638df98} fill="#849396" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Heading3() {
  return (
    <div className="relative shrink-0" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[7.99px] items-center relative size-full">
        <Container11 />
        <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#d4e4fa] text-[12px] tracking-[0.6px] uppercase whitespace-nowrap">
          <p className="leading-[16px]">PIPELINE STATUS</p>
        </div>
      </div>
    </div>
  );
}

function OverlayBlur1() {
  return (
    <div className="backdrop-blur-[6px] relative shrink-0" data-name="OverlayBlur">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <div className="bg-[#00e5ff] relative rounded-[9999px] shrink-0 size-[6px]" data-name="Background" />
        <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#00e5ff] text-[12px] tracking-[0.6px] whitespace-nowrap">
          <p className="leading-[16px]">ACTIVE</p>
        </div>
      </div>
    </div>
  );
}

function OverlayHorizontalBorder1() {
  return (
    <div className="bg-[rgba(5,20,36,0.5)] relative shrink-0 w-full" data-name="Overlay+HorizontalBorder">
      <div aria-hidden className="absolute border-[rgba(255,255,255,0.1)] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pb-[13px] pl-[12px] pr-[12.01px] pt-[12px] relative size-full">
          <Heading3 />
          <OverlayBlur1 />
        </div>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="h-[7.015px] relative shrink-0 w-[9.508px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="7.01458" preserveAspectRatio="none" viewBox="0 0 9.50833 7.01458" width="9.50833">
        <g id="Container">
          <path d={svgPaths.p25f8ca80} fill="#B0C6FF" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function BackgroundBorder2() {
  return (
    <div className="bg-[#051424] content-stretch flex items-center justify-center p-px relative rounded-[4px] shrink-0 size-[32px]" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#3b494c] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <Container14 />
    </div>
  );
}

function Heading4() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Heading 4">
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#d4e4fa] text-[12px] tracking-[0.6px] whitespace-nowrap">
        <p className="leading-[16px]">Image Preprocessing</p>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#b0c6ff] text-[10px] whitespace-nowrap">
        <p className="leading-[20px]">DONE</p>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-between relative size-full">
        <Heading4 />
        <Container16 />
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#bac9cc] text-[12px] w-full">
          <p className="leading-[16px] mb-0">Radiometric normalization and</p>
          <p className="leading-[16px] mb-0">atmospheric correction sequence</p>
          <p className="leading-[16px]">complete.</p>
        </div>
      </div>
    </div>
  );
}

function OverlayBorder() {
  return (
    <div className="bg-[rgba(39,54,71,0.3)] flex-[1_0_0] min-w-px relative rounded-[4px]" data-name="Overlay+Border">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="content-stretch flex flex-col gap-[4px] items-start p-[13px] relative size-full">
        <Container15 />
        <Container17 />
      </div>
    </div>
  );
}

function Node1Done() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-name="Node 1: Done">
      <BackgroundBorder2 />
      <OverlayBorder />
    </div>
  );
}

function Container18() {
  return (
    <div className="h-[7.015px] relative shrink-0 w-[9.508px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="7.01458" preserveAspectRatio="none" viewBox="0 0 9.50833 7.01458" width="9.50833">
        <g id="Container">
          <path d={svgPaths.p25f8ca80} fill="#B0C6FF" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function BackgroundBorder3() {
  return (
    <div className="bg-[#051424] content-stretch flex items-center justify-center p-px relative rounded-[4px] shrink-0 size-[32px]" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#3b494c] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <Container18 />
    </div>
  );
}

function Heading5() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Heading 4">
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#d4e4fa] text-[12px] tracking-[0.6px] whitespace-nowrap">
        <p className="leading-[16px]">Tiling</p>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#b0c6ff] text-[10px] whitespace-nowrap">
        <p className="leading-[20px]">DONE</p>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-between relative size-full">
        <Heading5 />
        <Container20 />
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#bac9cc] text-[12px] w-full">
          <p className="leading-[16px] mb-0">Spatial tessellation: 168 discrete</p>
          <p className="leading-[16px]">processing extents generated.</p>
        </div>
      </div>
    </div>
  );
}

function OverlayBorder1() {
  return (
    <div className="bg-[rgba(39,54,71,0.3)] flex-[1_0_0] min-w-px relative rounded-[4px]" data-name="Overlay+Border">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="content-stretch flex flex-col gap-[4px] items-start p-[13px] relative size-full">
        <Container19 />
        <Container21 />
      </div>
    </div>
  );
}

function Node2Done() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-name="Node 2: Done">
      <BackgroundBorder3 />
      <OverlayBorder1 />
    </div>
  );
}

function Container22() {
  return (
    <div className="h-[7.015px] relative shrink-0 w-[9.508px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="7.01458" preserveAspectRatio="none" viewBox="0 0 9.50833 7.01458" width="9.50833">
        <g id="Container">
          <path d={svgPaths.p25f8ca80} fill="#B0C6FF" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function BackgroundBorder4() {
  return (
    <div className="bg-[#051424] content-stretch flex items-center justify-center p-px relative rounded-[4px] shrink-0 size-[32px]" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#3b494c] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <Container22 />
    </div>
  );
}

function Heading6() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Heading 4">
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#d4e4fa] text-[12px] tracking-[0.6px] whitespace-nowrap">
        <p className="leading-[16px]">Building Extraction</p>
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#b0c6ff] text-[10px] whitespace-nowrap">
        <p className="leading-[20px]">DONE</p>
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-between relative size-full">
        <Heading6 />
        <Container24 />
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#bac9cc] text-[12px] w-full">
          <p className="leading-[16px] mb-0">Geospatial inference: 4,281</p>
          <p className="leading-[16px] mb-0">planimetric footprints identified</p>
          <p className="leading-[16px]">via ResNet-50-U-Net.</p>
        </div>
      </div>
    </div>
  );
}

function OverlayBorder2() {
  return (
    <div className="bg-[rgba(39,54,71,0.3)] flex-[1_0_0] min-w-px relative rounded-[4px]" data-name="Overlay+Border">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="content-stretch flex flex-col gap-[4px] items-start p-[13px] relative size-full">
        <Container23 />
        <Container25 />
      </div>
    </div>
  );
}

function Node3Done() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-name="Node 3: Done">
      <BackgroundBorder4 />
      <OverlayBorder2 />
    </div>
  );
}

function Container26() {
  return (
    <div className="h-[7.015px] relative shrink-0 w-[9.508px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="7.01458" preserveAspectRatio="none" viewBox="0 0 9.50833 7.01458" width="9.50833">
        <g id="Container">
          <path d={svgPaths.p25f8ca80} fill="#B0C6FF" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function BackgroundBorder5() {
  return (
    <div className="bg-[#051424] content-stretch flex items-center justify-center p-px relative rounded-[4px] shrink-0 size-[32px]" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#3b494c] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <Container26 />
    </div>
  );
}

function Heading7() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Heading 4">
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#d4e4fa] text-[12px] tracking-[0.6px] whitespace-nowrap">
        <p className="leading-[16px]">Road Extraction</p>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#b0c6ff] text-[10px] whitespace-nowrap">
        <p className="leading-[20px]">DONE</p>
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-between relative size-full">
        <Heading7 />
        <Container28 />
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#bac9cc] text-[12px] w-full">
          <p className="leading-[16px] mb-0">Linear feature vectorization and</p>
          <p className="leading-[16px] mb-0">graph-theory topology generation</p>
          <p className="leading-[16px]">complete.</p>
        </div>
      </div>
    </div>
  );
}

function OverlayBorder3() {
  return (
    <div className="bg-[rgba(39,54,71,0.3)] flex-[1_0_0] min-w-px relative rounded-[4px]" data-name="Overlay+Border">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="content-stretch flex flex-col gap-[4px] items-start p-[13px] relative size-full">
        <Container27 />
        <Container29 />
      </div>
    </div>
  );
}

function Node4Done() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-name="Node 4: Done">
      <BackgroundBorder5 />
      <OverlayBorder3 />
    </div>
  );
}

function Container30() {
  return (
    <div className="relative shrink-0 size-[9.333px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="9.33333" preserveAspectRatio="none" viewBox="0 0 9.33333 9.33333" width="9.33333">
        <g id="Container">
          <path d={svgPaths.p12851510} fill="#00E5FF" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function OverlayBorder4() {
  return (
    <div className="bg-[rgba(0,229,255,0.1)] content-stretch flex items-center justify-center p-px relative rounded-[4px] shrink-0 size-[32px]" data-name="Overlay+Border">
      <div aria-hidden className="absolute border border-[#00e5ff] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <Container30 />
    </div>
  );
}

function Heading8() {
  return (
    <div className="content-stretch flex flex-col items-start pr-[55.93px] relative self-stretch shrink-0" data-name="Heading 4">
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#00e5ff] text-[12px] tracking-[0.6px] whitespace-nowrap">
        <p className="leading-[16px] mb-0">Feature Post-</p>
        <p className="leading-[16px]">processing</p>
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#00e5ff] text-[10px] whitespace-nowrap">
        <p className="leading-[20px]">ACTIVE</p>
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-between relative size-full">
        <Heading8 />
        <Container32 />
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[4px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#bac9cc] text-[12px] w-full">
          <p className="leading-[16px] mb-0">Douglas-Peucker simplification</p>
          <p className="leading-[16px] mb-0">and topological reconciliation in</p>
          <p className="leading-[16px]">progress.</p>
        </div>
      </div>
    </div>
  );
}

function Background() {
  return (
    <div className="bg-[#122131] h-[4px] relative rounded-[9999px] shrink-0 w-full" data-name="Background">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <div className="absolute bg-[#00e5ff] h-[4px] left-0 right-[28%] rounded-[9999px] top-0" data-name="Background" />
      </div>
    </div>
  );
}

function OverlayBorderShadow() {
  return (
    <div className="bg-[rgba(39,54,71,0.5)] flex-[1_0_0] min-w-px relative rounded-[4px]" data-name="Overlay+Border+Shadow">
      <div aria-hidden className="absolute border border-[rgba(0,229,255,0.3)] border-solid inset-0 pointer-events-none rounded-[4px] shadow-[0px_4px_12px_0px_rgba(0,229,255,0.05)]" />
      <div className="content-stretch flex flex-col gap-[4px] items-start p-[13px] relative size-full">
        <Container31 />
        <Container33 />
        <Background />
      </div>
    </div>
  );
}

function Node5Active() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-name="Node 5: Active">
      <OverlayBorder4 />
      <OverlayBorderShadow />
    </div>
  );
}

function Container34() {
  return (
    <div className="relative shrink-0 size-[11.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="11.6667" preserveAspectRatio="none" viewBox="0 0 11.6667 11.6667" width="11.6667">
        <g id="Container">
          <path d={svgPaths.p29478120} fill="#3B494C" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function BackgroundBorder6() {
  return (
    <div className="bg-[#051424] content-stretch flex items-center justify-center p-px relative rounded-[4px] shrink-0 size-[32px]" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[rgba(59,73,76,0.3)] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <Container34 />
    </div>
  );
}

function Heading9() {
  return (
    <div className="content-stretch flex flex-col items-start pr-[42.13px] relative self-stretch shrink-0" data-name="Heading 4">
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#bac9cc] text-[12px] tracking-[0.6px] whitespace-nowrap">
        <p className="leading-[16px] mb-0">Parcel</p>
        <p className="leading-[16px]">Reconstruction</p>
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#3b494c] text-[10px] whitespace-nowrap">
        <p className="leading-[20px]">PENDING</p>
      </div>
    </div>
  );
}

function Container35() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-between relative size-full">
        <Heading9 />
        <Container36 />
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#3b494c] text-[12px] w-full">
          <p className="leading-[16px] mb-0">Queued: Cadastral boundary</p>
          <p className="leading-[16px] mb-0">synthesis and adjacency</p>
          <p className="leading-[16px]">verification.</p>
        </div>
      </div>
    </div>
  );
}

function OverlayBorder5() {
  return (
    <div className="bg-[rgba(5,20,36,0.3)] flex-[1_0_0] min-w-px relative rounded-[4px]" data-name="Overlay+Border">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.1)] border-dashed inset-0 pointer-events-none rounded-[4px]" />
      <div className="content-stretch flex flex-col gap-[4px] items-start p-[13px] relative size-full">
        <Container35 />
        <Container37 />
      </div>
    </div>
  );
}

function Node6Pending() {
  return (
    <div className="content-stretch flex gap-[16px] items-start opacity-50 relative shrink-0 w-full" data-name="Node 6: Pending">
      <BackgroundBorder6 />
      <OverlayBorder5 />
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-name="Container">
      <div className="absolute bg-[rgba(59,73,76,0.5)] bottom-[16px] left-[15px] top-[16px] w-px" data-name="Vertical connecting line" />
      <Node1Done />
      <Node2Done />
      <Node3Done />
      <Node4Done />
      <Node5Active />
      <Node6Pending />
    </div>
  );
}

function Container12() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="Container">
      <div className="overflow-auto rounded-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[53px] pt-[40px] px-[16px] relative size-full">
          <Container13 />
        </div>
      </div>
    </div>
  );
}

function CenterPipelineVisualization() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(13,28,45,0.8)] h-full relative rounded-[12px] shrink-0 w-[301.33px]" data-name="Center: Pipeline Visualization">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <OverlayHorizontalBorder1 />
        <Container12 />
      </div>
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function Container38() {
  return (
    <div className="relative shrink-0 size-[10.5px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="10.5" preserveAspectRatio="none" viewBox="0 0 10.5 10.5" width="10.5">
        <g id="Container">
          <path d={svgPaths.p3c511d80} fill="#849396" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Heading10() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[7.99px] items-center relative size-full">
        <Container38 />
        <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#d4e4fa] text-[12px] tracking-[0.6px] uppercase whitespace-nowrap">
          <p className="leading-[16px]">LIVE METRICS</p>
        </div>
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#bac9cc] text-[10px] w-full">
          <p className="leading-[20px]">OVERALL PROGRESS</p>
        </div>
      </div>
    </div>
  );
}

function Container42() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#00e5ff] text-[24px] tracking-[-0.24px] whitespace-nowrap">
        <p className="leading-[32px]">72</p>
      </div>
    </div>
  );
}

function Container43() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[4px] relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#00e5ff] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">%</p>
      </div>
    </div>
  );
}

function Container41() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-end relative size-full">
        <Container42 />
        <Container43 />
      </div>
    </div>
  );
}

function OverlayBorder6() {
  return (
    <div className="bg-[rgba(5,20,36,0.5)] col-1 justify-self-stretch relative rounded-[8px] row-1 self-start shrink-0" data-name="Overlay+Border">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col gap-[4px] items-start p-[13px] relative size-full">
        <Container40 />
        <Container41 />
      </div>
    </div>
  );
}

function Container44() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#bac9cc] text-[10px] w-full">
          <p className="leading-[20px]">TILES PROCESSED</p>
        </div>
      </div>
    </div>
  );
}

function Container46() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#d4e4fa] text-[24px] tracking-[-0.24px] whitespace-nowrap">
        <p className="leading-[32px]">124</p>
      </div>
    </div>
  );
}

function Container47() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[4px] relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#bac9cc] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">/168</p>
      </div>
    </div>
  );
}

function Container45() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-end relative size-full">
        <Container46 />
        <Container47 />
      </div>
    </div>
  );
}

function OverlayBorder7() {
  return (
    <div className="bg-[rgba(5,20,36,0.5)] col-2 justify-self-stretch relative rounded-[8px] row-1 self-start shrink-0" data-name="Overlay+Border">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col gap-[4px] items-start p-[13px] relative size-full">
        <Container44 />
        <Container45 />
      </div>
    </div>
  );
}

function Container48() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#bac9cc] text-[10px] w-full">
          <p className="leading-[20px]">EST. REMAINING</p>
        </div>
      </div>
    </div>
  );
}

function Container50() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px relative" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#b0c6ff] text-[18px] w-full">
        <p className="leading-[28px]">01:42</p>
      </div>
    </div>
  );
}

function Container49() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-end relative size-full">
        <Container50 />
      </div>
    </div>
  );
}

function OverlayBorder8() {
  return (
    <div className="bg-[rgba(5,20,36,0.5)] col-1 justify-self-stretch relative rounded-[8px] row-2 self-start shrink-0" data-name="Overlay+Border">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col gap-[4px] items-start p-[13px] relative size-full">
        <Container48 />
        <Container49 />
      </div>
    </div>
  );
}

function Container51() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#bac9cc] text-[10px] w-full">
          <p className="leading-[20px]">CONFIDENCE S.</p>
        </div>
      </div>
    </div>
  );
}

function Container53() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px relative" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#d4e4fa] text-[18px] w-full">
        <p className="leading-[28px]">92.8%</p>
      </div>
    </div>
  );
}

function Container52() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-end relative size-full">
        <Container53 />
      </div>
    </div>
  );
}

function OverlayBorder9() {
  return (
    <div className="bg-[rgba(5,20,36,0.5)] col-2 justify-self-stretch relative rounded-[8px] row-2 self-start shrink-0" data-name="Overlay+Border">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col gap-[4px] items-start p-[13px] relative size-full">
        <Container51 />
        <Container52 />
      </div>
    </div>
  );
}

function Container39() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid gap-x-[16px] gap-y-[16px] grid grid-cols-[repeat(2,minmax(0,1fr))] grid-rows-[__82px_78px] relative size-full">
        <OverlayBorder6 />
        <OverlayBorder7 />
        <OverlayBorder8 />
        <OverlayBorder9 />
      </div>
    </div>
  );
}

function Container56() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#bac9cc] text-[10px] whitespace-nowrap">
        <p className="leading-[20px]">SYSTEM LOAD</p>
      </div>
    </div>
  );
}

function Container57() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#bac9cc] text-[10px] whitespace-nowrap">
        <p className="leading-[20px]">85% CPU / 14GB VRAM</p>
      </div>
    </div>
  );
}

function Container55() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Container56 />
      <Container57 />
    </div>
  );
}

function Background1() {
  return (
    <div className="bg-[#122131] content-stretch flex h-[6px] items-start overflow-clip relative rounded-[9999px] shrink-0 w-full" data-name="Background">
      <div className="bg-[#00e5ff] h-full mr-[-0.01px] relative shrink-0 w-[160.41px]" data-name="Background" />
      <div className="bg-[#b0c6ff] h-full relative shrink-0 w-[66.83px]" data-name="Background" />
    </div>
  );
}

function Container54() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start relative size-full">
        <Container55 />
        <Background1 />
      </div>
    </div>
  );
}

function MetricsModule() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(13,28,45,0.8)] relative rounded-[12px] shrink-0 w-full" data-name="Metrics Module">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col gap-[16px] items-start p-[17px] relative size-full">
        <Heading10 />
        <Container39 />
        <Container54 />
      </div>
    </div>
  );
}

function Container58() {
  return (
    <div className="h-[9.333px] relative shrink-0 w-[11.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="9.33333" preserveAspectRatio="none" viewBox="0 0 11.6667 9.33333" width="11.6667">
        <g id="Container">
          <path d={svgPaths.p3cc66d00} fill="#849396" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Heading11() {
  return (
    <div className="relative shrink-0" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[7.99px] items-center relative size-full">
        <Container58 />
        <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#d4e4fa] text-[12px] tracking-[0.6px] uppercase whitespace-nowrap">
          <p className="leading-[16px]">PROCESS LOG</p>
        </div>
      </div>
    </div>
  );
}

function Container59() {
  return (
    <div className="h-[7px] relative shrink-0 w-[10.5px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="7" preserveAspectRatio="none" viewBox="0 0 10.5 7" width="10.5">
        <g id="Container">
          <path d={svgPaths.p3592ed80} fill="#BAC9CC" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(255,255,255,0.05)] relative rounded-[4px] shrink-0" data-name="Button">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[4px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-[5px] relative size-full">
        <Container59 />
      </div>
    </div>
  );
}

function OverlayHorizontalBorder2() {
  return (
    <div className="bg-[rgba(5,20,36,0.5)] relative shrink-0 w-full" data-name="Overlay+HorizontalBorder">
      <div aria-hidden className="absolute border-[rgba(255,255,255,0.1)] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pb-[13px] pt-[12px] px-[12px] relative size-full">
          <Heading11 />
          <Button2 />
        </div>
      </div>
    </div>
  );
}

function Container60() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.81px] relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#b0c6ff] text-[11px] w-full">
        <p className="mb-0">
          <span className="leading-[17.88px]">[TELEMETRY]</span>
          <span className="[word-break:break-word] font-['JetBrains_Mono:Medium',sans-serif] font-medium leading-[17.88px] text-[#849396]">{` Initializing compute node`}</span>
        </p>
        <p className="leading-[17.88px] text-[#849396]">GPU-03 [CUDA 12.1]...</p>
      </div>
    </div>
  );
}

function Container61() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.81px] relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#b0c6ff] text-[11px] w-full">
        <p className="mb-0">
          <span className="leading-[17.88px]">[TELEMETRY]</span>
          <span className="[word-break:break-word] font-['JetBrains_Mono:Medium',sans-serif] font-medium leading-[17.88px] text-[#849396]">{` Loading weights:`}</span>
        </p>
        <p className="leading-[17.88px] text-[#849396]">model_v4.2_urban_segmentation.pt</p>
      </div>
    </div>
  );
}

function Container62() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.81px] relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#00e5ff] text-[11px] w-full">
        <p className="mb-0">
          <span className="leading-[17.88px]">[SYSTEM]</span>
          <span className="[word-break:break-word] font-['JetBrains_Mono:Medium',sans-serif] font-medium leading-[17.88px] text-[#849396]">{` VRAM Allocation: 12.4GB / 24GB`}</span>
        </p>
        <p className="leading-[17.88px] text-[#849396]">[OK]</p>
      </div>
    </div>
  );
}

function Container63() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.81px] relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#b0c6ff] text-[11px] w-full">
        <p className="mb-0">
          <span className="leading-[17.88px]">[TELEMETRY]</span>
          <span className="[word-break:break-word] font-['JetBrains_Mono:Medium',sans-serif] font-medium leading-[17.88px] text-[#849396]">{` Executing inference pipeline`}</span>
        </p>
        <p className="leading-[17.88px] text-[#849396]">on Sector 4...</p>
      </div>
    </div>
  );
}

function Container64() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.81px] relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#3b494c] text-[11px] w-full">
        <p className="leading-[17.88px] mb-0">{`> CRS Transformation: EPSG:4326 (WGS84) -`}</p>
        <p className="leading-[17.88px]">{`> EPSG:3857 (Web Mercator)`}</p>
      </div>
    </div>
  );
}

function Container65() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.81px] relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#b0c6ff] text-[11px] w-full">
        <p className="mb-0">
          <span className="leading-[17.88px]">[TELEMETRY]</span>
          <span className="[word-break:break-word] font-['JetBrains_Mono:Medium',sans-serif] font-medium leading-[17.88px] text-[#849396]">{` Tile 121: 34 feature`}</span>
        </p>
        <p className="leading-[17.88px] text-[#849396]">geometries serialized.</p>
      </div>
    </div>
  );
}

function Container66() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.81px] relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#b0c6ff] text-[11px] w-full">
        <p className="mb-0">
          <span className="leading-[17.88px]">[TELEMETRY]</span>
          <span className="[word-break:break-word] font-['JetBrains_Mono:Medium',sans-serif] font-medium leading-[17.88px] text-[#849396]">{` Tile 122: 12 feature`}</span>
        </p>
        <p className="leading-[17.88px] text-[#849396]">geometries serialized.</p>
      </div>
    </div>
  );
}

function Container67() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.81px] relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#d4e4fa] text-[11px] w-full">
        <p className="leading-[17.88px] mb-0">{`> Applying Douglas-Peucker simplification`}</p>
        <p className="leading-[17.88px]">(tolerance: 0.5m)...</p>
      </div>
    </div>
  );
}

function Container68() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.81px] relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#b0c6ff] text-[11px] w-full">
        <p className="mb-0">
          <span className="leading-[17.88px]">[TELEMETRY]</span>
          <span className="[word-break:break-word] font-['JetBrains_Mono:Medium',sans-serif] font-medium leading-[17.88px] text-[#849396]">{` Tile 123: 45 feature`}</span>
        </p>
        <p className="leading-[17.88px] text-[#849396]">geometries serialized.</p>
      </div>
    </div>
  );
}

function Container69() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.81px] relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#ffb4ab] text-[11px] w-full">
        <p className="mb-0">
          <span className="leading-[17.88px]">[WARNING]</span>
          <span className="[word-break:break-word] font-['JetBrains_Mono:Medium',sans-serif] font-medium leading-[17.88px] text-[#849396]">{` Tile 124: Confidence threshold`}</span>
        </p>
        <p className="leading-[17.88px] text-[#849396]">{`violation [0.62 < 0.85] on Cluster A.`}</p>
      </div>
    </div>
  );
}

function Container70() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.81px] relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#d4e4fa] text-[11px] w-full">
        <p className="leading-[17.88px] mb-0">{`> Initiating topological reconciliation:`}</p>
        <p className="leading-[17.88px]">resolving self-intersections...</p>
      </div>
    </div>
  );
}

function Container71() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.88px] relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#00e5ff] text-[11px] w-full">
        <p className="leading-[17.88px]">_</p>
      </div>
    </div>
  );
}

function Overlay1() {
  return (
    <div className="bg-[rgba(1,15,31,0.8)] flex-[1_0_0] min-h-px relative w-full" data-name="Overlay">
      <div className="overflow-auto rounded-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[2.9px] items-start pb-[35.87px] pt-[10.94px] px-[12px] relative size-full">
          <Container60 />
          <Container61 />
          <Container62 />
          <Container63 />
          <Container64 />
          <Container65 />
          <Container66 />
          <Container67 />
          <Container68 />
          <Container69 />
          <Container70 />
          <Container71 />
        </div>
      </div>
    </div>
  );
}

function TerminalLogsModule() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(13,28,45,0.8)] flex-[1_0_0] min-h-px relative rounded-[12px] w-full" data-name="Terminal Logs Module">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <OverlayHorizontalBorder2 />
        <Overlay1 />
      </div>
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function RightLiveMetricsLogs() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] h-full items-start relative shrink-0 w-[301.34px]" data-name="Right: Live Metrics & Logs">
      <MetricsModule />
      <TerminalLogsModule />
    </div>
  );
}

function ThreeColumnLayout() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[12px] items-start justify-center min-h-px relative w-full" data-name="Three Column Layout">
      <LeftSourceImagery />
      <CenterPipelineVisualization />
      <RightLiveMetricsLogs />
    </div>
  );
}

function ContentCanvasLevel() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full z-[2]" data-name="Content Canvas Level 1/2">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start p-[16px] relative size-full">
          <PageTitleAreaMargin />
          <ThreeColumnLayout />
        </div>
      </div>
    </div>
  );
}

function MainContentArea() {
  return (
    <div className="bg-[#051424] content-stretch flex flex-[1_0_0] flex-col h-[1024px] isolate items-start min-w-px relative" data-name="Main Content Area">
      <HeaderTopNavBarSharedComponent />
      <ContentCanvasLevel />
      <div className="absolute inset-0 mix-blend-screen opacity-20 z-[1]" data-name="Map Background Level 0">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute bg-size-[512px_279px] bg-top-left inset-0" style={{ backgroundImage: `url("${imgMapBackgroundLevel0}")` }} />
          <div className="absolute bg-white inset-0 mix-blend-saturation" />
        </div>
      </div>
    </div>
  );
}

function Container72() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="18" preserveAspectRatio="none" viewBox="0 0 18 18" width="18">
        <g id="Container">
          <path d={svgPaths.p1f0e7f00} fill="#00E5FF" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function BackgroundBorder7() {
  return (
    <div className="bg-[#122131] relative rounded-[8px] shrink-0 size-[40px]" data-name="Background+Border">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center overflow-clip p-px relative rounded-[inherit] size-full">
        <Container72 />
      </div>
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
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

function Container74() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#bac9cc] text-[12px] tracking-[0.6px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">GIS COMMAND CENTER</p>
      </div>
    </div>
  );
}

function Container73() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Heading />
        <Container74 />
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="relative shrink-0 w-full" data-name="Header">
      <div aria-hidden className="absolute border-[rgba(255,255,255,0.1)] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center pb-[17px] pt-[16px] px-[16px] relative size-full">
          <BackgroundBorder7 />
          <Container73 />
        </div>
      </div>
    </div>
  );
}

function Container75() {
  return (
    <div className="h-[13.333px] relative shrink-0 w-[17.917px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="13.3333" preserveAspectRatio="none" viewBox="0 0 17.9167 13.3333" width="17.9167">
        <g id="Container">
          <path d={svgPaths.p6200b00} fill="#BAC9CC" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function ItemLink() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="Item → Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[12px] py-[8px] relative size-full">
          <Container75 />
          <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#bac9cc] text-[14px] whitespace-nowrap">
            <p className="leading-[20px]">Projects</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container76() {
  return (
    <div className="h-[16.667px] relative shrink-0 w-[15.843px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="16.6667" preserveAspectRatio="none" viewBox="0 0 15.8431 16.6667" width="15.8431">
        <g id="Container">
          <path d={svgPaths.p23f73180} fill="#00E5FF" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function ItemLink1() {
  return (
    <div className="flex h-[35.28px] items-center justify-center relative shrink-0 w-[304.78px]">
      <div className="flex-none scale-x-98 scale-y-98">
        <div className="content-stretch flex gap-[12px] items-center pl-[12px] pr-[14px] py-[8px] relative rounded-[8px] w-[311px]" data-name="Item → Link">
          <div aria-hidden className="absolute bg-[rgba(0,229,255,0.05)] inset-0 pointer-events-none rounded-[8px]" />
          <div aria-hidden className="absolute border-[#00e5ff] border-r-2 border-solid inset-0 pointer-events-none rounded-[8px]" />
          <Container76 />
          <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#00e5ff] text-[14px] whitespace-nowrap">
            <p className="leading-[20px]">AI Processing</p>
          </div>
          <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_2px_4px_0px_rgba(0,0,0,0.05)]" />
        </div>
      </div>
    </div>
  );
}

function Container77() {
  return (
    <div className="relative shrink-0 size-[15px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="15" preserveAspectRatio="none" viewBox="0 0 15 15" width="15">
        <g id="Container">
          <path d={svgPaths.p21559b80} fill="#BAC9CC" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function ItemLink2() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="Item → Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[12px] py-[8px] relative size-full">
          <Container77 />
          <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#bac9cc] text-[14px] whitespace-nowrap">
            <p className="leading-[20px]">WebGIS</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container78() {
  return (
    <div className="h-[15px] relative shrink-0 w-[16.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="15" preserveAspectRatio="none" viewBox="0 0 16.6667 15" width="16.6667">
        <g id="Container">
          <path d={svgPaths.p2eb03400} fill="#BAC9CC" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function ItemLink3() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="Item → Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[12px] py-[8px] relative size-full">
          <Container78 />
          <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#bac9cc] text-[14px] whitespace-nowrap">
            <p className="leading-[20px]">Validation</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container79() {
  return (
    <div className="relative shrink-0 size-[15px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="15" preserveAspectRatio="none" viewBox="0 0 15 15" width="15">
        <g id="Container">
          <path d={svgPaths.p1d75e100} fill="#BAC9CC" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function ItemLink4() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="Item → Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[12px] py-[8px] relative size-full">
          <Container79 />
          <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#bac9cc] text-[14px] whitespace-nowrap">
            <p className="leading-[20px]">Parcels</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container80() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-[13.333px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="17.5" preserveAspectRatio="none" viewBox="0 0 13.3333 17.5" width="13.3333">
        <g id="Container">
          <path d={svgPaths.p105e9c80} fill="#BAC9CC" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function ItemLink5() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="Item → Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[12px] py-[8px] relative size-full">
          <Container80 />
          <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#bac9cc] text-[14px] whitespace-nowrap">
            <p className="leading-[20px]">Exports</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container81() {
  return (
    <div className="h-[15px] relative shrink-0 w-[16.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="15" preserveAspectRatio="none" viewBox="0 0 16.6667 15" width="16.6667">
        <g id="Container">
          <path d={svgPaths.p26dc2a80} fill="#BAC9CC" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function ItemLink6() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="Item → Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[12px] py-[8px] relative size-full">
          <Container81 />
          <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#bac9cc] text-[14px] whitespace-nowrap">
            <p className="leading-[20px]">Analytics</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ListNavigationLinks() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="List - Navigation Links">
      <div className="flex flex-col items-center overflow-auto rounded-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-center px-[4px] py-[12px] relative size-full">
          <ItemLink />
          <ItemLink1 />
          <ItemLink2 />
          <ItemLink3 />
          <ItemLink4 />
          <ItemLink5 />
          <ItemLink6 />
        </div>
      </div>
    </div>
  );
}

function Container82() {
  return (
    <div className="h-[16.667px] relative shrink-0 w-[16.75px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="16.6667" preserveAspectRatio="none" viewBox="0 0 16.75 16.6667" width="16.75">
        <g id="Container">
          <path d={svgPaths.p18e22d80} fill="#BAC9CC" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function ItemLink7() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="Item → Link">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center px-[12px] py-[8px] relative size-full">
          <Container82 />
          <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#bac9cc] text-[14px] whitespace-nowrap">
            <p className="leading-[20px]">Settings</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container83() {
  return (
    <div className="relative shrink-0 size-[16.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="16.6667" preserveAspectRatio="none" viewBox="0 0 16.6667 16.6667" width="16.6667">
        <g id="Container">
          <path d={svgPaths.p16f8b100} fill="#BAC9CC" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function ItemLink8() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="Item → Link">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center px-[12px] py-[8px] relative size-full">
          <Container83 />
          <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#bac9cc] text-[14px] whitespace-nowrap">
            <p className="leading-[20px]">Help</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ListFooterLinks() {
  return (
    <div className="relative shrink-0 w-full" data-name="List - Footer Links">
      <div aria-hidden className="absolute border-[rgba(255,255,255,0.1)] border-solid border-t inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start pb-[4px] pt-[5px] px-[4px] relative size-full">
        <ItemLink7 />
        <ItemLink8 />
      </div>
    </div>
  );
}

function SideNavBarSharedComponent() {
  return (
    <div className="absolute backdrop-blur-[12px] bg-[rgba(5,20,36,0.8)] content-stretch flex flex-col h-[1024px] items-start left-0 pr-px top-0 w-[320px]" data-name="SideNavBar (Shared Component)">
      <div aria-hidden className="absolute border-[rgba(255,255,255,0.1)] border-r border-solid inset-0 pointer-events-none" />
      <Header />
      <ListNavigationLinks />
      <ListFooterLinks />
    </div>
  );
}

export default function CadastraAiInteractiveAiProcessingPipeline() {
  return (
    <div className="content-stretch flex items-start justify-center pl-[320px] relative size-full" style={{ backgroundImage: "linear-gradient(90deg, rgb(5, 20, 36) 0%, rgb(5, 20, 36) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }} data-name="CadastraAI - Interactive AI Processing Pipeline">
      <MainContentArea />
      <SideNavBarSharedComponent />
    </div>
  );
}