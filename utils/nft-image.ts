import prand from "pure-rand";
import svgSlim from "svg-slimming";

export const generateNftSvg = async (
  seed: string,
  streamId: number,
  tokenIdentifier: string,
  canCancel: boolean,
  duration: number
): Promise<string> => {
  const streamBaseColor = await generateRandomHSLColor(seed);
  const streamBaseColorSecondary = await generateRandomHSLColor(seed, 0.6);

  const durationString = duration === 0 ? "&lt; 1 Day" : duration === 1 ? "1 Day" : `${duration} Days`;
  return svgSlim(`<svg xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink" width="1000" height="1000" fill="none"
  xmlns:v="https://vecta.io/nano">
  <style><![CDATA[.B{fill:#fff}.C{font-size:26px}.D{font-family:Courier New,Arial,monospace}.E{fill-opacity:.8}.F{font-family:Poppins,Arial,monosapce}]]></style>
  <g clip-path="url(#K)">
      <path d="M1000 0H0V1000H1000V0Z" fill="#000"/>
      <path d="M1000-10H0v1010h1000V-10z" fill="url(#B)"/>
      <g stroke-width="2" stroke-miterlimit="10">
          <path d="M647.402 336.6C629.002 355 610.402 373.6 592.002 392C581.402 402.4 575.402 402.2 564.602 392C539.402 367.8 516.802 341.2 489.802 319C450.602 286.8 375.002 288.6 336.002 321.2C288.202 361.2 281.202 423.4 307.602 470.4C338.802 525.8 421.002 545.8 476.602 514.4C487.002 508.6 496.402 501.4 504.802 493C524.202 473.6 543.802 454 563.202 434.6C575.402 422.4 581.202 422.2 593.002 434C629.802 470.6 666.602 507.4 703.202 544.2C714.002 555.2 713.402 559.4 702.802 571.2C666.402 611.4 622.602 638.6 569.202 650C470.002 671 355.602 626.6 303.002 540C249.602 452.4 254.002 345.6 316.802 264.6C398.202 160 545.002 144.8 644.202 204.6C668.202 219 687.402 238.4 706.802 258C714.402 265.6 711.602 272.4 705.002 278.8C685.802 298.2 666.602 317.4 647.402 336.6Z" fill="url(#C)" stroke="url(#D)"/>
          <use xlink:href="#L" opacity=".04" fill="url(#E)" stroke="url(#F)"/>
          <use xlink:href="#L" opacity=".48" fill="url(#E)" stroke="url(#F)"/>
          <use xlink:href="#M" opacity=".04" fill="url(#G)" stroke="url(#H)"/>
          <use xlink:href="#M" opacity=".48" fill="url(#G)" stroke="url(#H)"/>
          <use xlink:href="#N" opacity=".04" fill="url(#I)" stroke="url(#J)"/>
          <use xlink:href="#N" opacity=".48" fill="url(#I)" stroke="url(#J)"/>
      </g>
      <g fill="#f2f2f2">
          <path d="M149.998 753v1.4h-4.6v15.4h-1.6v-15.4h-4.6V753h10.8zm5 16c-1-.6-1.8-1.4-2.4-2.4s-.8-2.2-.8-3.6.2-2.6.8-3.6 1.4-1.8 2.4-2.4 2.2-.8 3.4-.8 2.4.2 3.4.8 1.8 1.4 2.4 2.4.8 2.2.8 3.6-.2 2.6-.8 3.6-1.4 1.8-2.4 2.4-2.2.8-3.4.8c-1.2.2-2.4-.2-3.4-.8zm5.8-1.2c.8-.4 1.4-1 1.8-1.8s.6-1.8.6-3-.2-2.2-.6-3-1-1.4-1.8-1.8-1.6-.6-2.4-.6-1.6.2-2.4.6-1.4 1-1.8 1.8-.6 1.8-.6 3 .2 2.2.6 3 1 1.4 1.8 1.8 1.6.6 2.4.6 1.6-.2 2.4-.6zm14.401 2l-5.4-5.8v5.8h-1.8V752h1.6v10.6l5.2-5.8h2.4l-6.2 6.6 6.2 6.6h-2v-.2z"/>
          <use xlink:href="#O"/>
          <path d="M204.397 757.8c1 1 1.4 2.4 1.4 4.2v7.6h-1.6v-7.4c0-1.4-.4-2.6-1-3.2s-1.6-1.2-3-1.2c-1.2 0-2.2.4-3 1.2s-1.2 2-1.2 3.6v7.2h-1.6v-13.2h1.6v2.2c.4-.8 1-1.4 1.8-1.8s1.6-.6 2.6-.6c1.8 0 3 .4 4 1.4zM417.8 754c1.4.6 2.4 1.6 3 3s1 2.8 1 4.6-.4 3.2-1 4.4c-.8 1.2-1.8 2.2-3 2.8s-3 1-4.8 1h-5V753h5c2 0 3.6.2 4.8 1zm.6 12.6c1.2-1.2 1.8-3 1.8-5.2s-.6-4-1.8-5.2-3-1.8-5.4-1.8h-3.2v14h3.2c2.4 0 4.2-.6 5.4-1.8zm17.998-10v13.2h-1.6v-2.4c-.4.8-1 1.4-1.8 1.8s-1.6.6-2.6.6c-1.6 0-2.8-.4-3.8-1.4s-1.4-2.4-1.4-4.2v-7.6h1.6v7.4c0 1.4.4 2.6 1 3.2.8.8 1.6 1.2 3 1.2 1.2 0 2.2-.4 3-1.2s1.2-2 1.2-3.6v-7.2h1.4v.2zm7.201.4c.8-.4 1.6-.6 2.8-.6v1.8h-.4a4.91 4.91 0 0 0-3 1c-.8.6-1.2 1.8-1.2 3.2v7.4h-1.6v-13.2h1.6v2.4c.4-.8 1-1.4 1.8-2zm5.4 2.6c.6-1 1.2-1.8 2.2-2.4s2-.8 3.2-.8 2.4.2 3.2.8c1 .6 1.6 1.4 2 2.2v-2.8h1.6v13.2h-1.6v-3c-.4.8-1 1.6-2 2.2s-2 .8-3.2.8-2.2-.2-3.2-.8-1.6-1.4-2.2-2.4-.8-2.2-.8-3.6.2-2.4.8-3.4zm10 .8c-.4-.8-1-1.4-1.8-1.8s-1.6-.6-2.4-.6c-1 0-1.8.2-2.4.6-.8.4-1.4 1-1.8 1.8s-.6 1.8-.6 2.8.2 2 .6 2.8 1 1.4 1.8 1.8 1.6.6 2.4.6 1.8-.2 2.4-.6c.8-.4 1.4-1 1.8-1.8s.6-1.8.6-2.8-.2-2-.6-2.8zm8.202-2.4v8.2c0 .8.2 1.4.4 1.6.4.4.8.4 1.6.4h1.6v1.4h-1.8c-1.2 0-2-.2-2.6-.8s-.8-1.4-.8-2.8v-8h-1.8v-1.4h1.8v-3.2h1.8v3.2h3.6v1.4h-3.8zm6.398-4.2c-.2-.2-.4-.6-.4-.8s.2-.6.4-.8.6-.4.8-.4.6.2.8.4.4.6.4.8-.2.6-.4.8-.6.4-.8.4-.6-.2-.8-.4zm1.8 2.8v13.2h-1.6v-13.2h1.6zm6.202 12.4c-1-.6-1.8-1.4-2.4-2.4s-.8-2.2-.8-3.6.2-2.6.8-3.6 1.4-1.8 2.4-2.4 2.2-.8 3.4-.8 2.4.2 3.4.8 1.8 1.4 2.4 2.4.8 2.2.8 3.6-.2 2.6-.8 3.6-1.4 1.8-2.4 2.4-2.2.8-3.4.8c-1.4.2-2.4-.2-3.4-.8zm5.6-1.2c.8-.4 1.4-1 1.8-1.8s.6-1.8.6-3-.2-2.2-.6-3-1-1.4-1.8-1.8-1.6-.6-2.4-.6-1.6.2-2.4.6-1.4 1-1.8 1.8-.6 1.8-.6 3 .2 2.2.6 3 1 1.4 1.8 1.8 1.6.6 2.4.6c1 0 1.8-.2 2.4-.6zm17.399-10c1 1 1.4 2.4 1.4 4.2v7.6h-1.6v-7.4c0-1.4-.4-2.6-1-3.2-.8-.8-1.6-1.2-3-1.2-1.2 0-2.2.4-3 1.2s-1.2 2-1.2 3.6v7.2h-1.6v-13.2h1.6v2.2c.4-.8 1-1.4 1.8-1.8s1.6-.6 2.6-.6c1.6 0 3 .4 4 1.4zm167-.8c.8-1.4 1.8-2.4 3-3 1.2-.8 2.6-1 4.2-1 1.8 0 3.4.4 4.8 1.4 1.4.8 2.4 2.2 3 3.8h-2c-.4-1.2-1.2-2-2.2-2.6s-2.2-1-3.6-1c-1.2 0-2.4.2-3.4.8s-1.8 1.4-2.4 2.4-.8 2.4-.8 3.8.2 2.6.8 3.8c.6 1 1.4 1.8 2.4 2.4s2 .8 3.4.8 2.6-.4 3.6-1 1.8-1.6 2.2-2.6h2c-.6 1.6-1.6 2.8-3 3.8s-3 1.4-4.8 1.4c-1.6 0-3-.4-4.2-1a10.71 10.71 0 0 1-3-3c-.8-1.2-1-2.8-1-4.4-.2-2.2.2-3.6 1-4.8zm18.2 2.6c.6-1 1.2-1.8 2.2-2.4s2-.8 3.2-.8 2.4.2 3.2.8c1 .6 1.6 1.4 2 2.2v-2.8h1.6v13.2h-1.6v-3c-.4.8-1 1.6-2 2.2s-2 .8-3.2.8-2.2-.2-3.2-.8-1.6-1.4-2.2-2.4-.8-2.2-.8-3.6.2-2.4.8-3.4zm10 .8c-.4-.8-1-1.4-1.8-1.8s-1.6-.6-2.4-.6c-1 0-1.8.2-2.4.6-.8.4-1.4 1-1.8 1.8s-.6 1.8-.6 2.8.2 2 .6 2.8 1 1.4 1.8 1.8 1.6.6 2.4.6 1.8-.2 2.4-.6 1.4-1 1.8-1.8.6-1.8.6-2.8-.2-2-.6-2.8zm16.2-2.6c1 1 1.4 2.4 1.4 4.2v7.6h-1.6v-7.4c0-1.4-.4-2.6-1-3.2-.8-.8-1.6-1.2-3-1.2-1.2 0-2.2.4-3 1.2s-1.2 2-1.2 3.6v7.2H706v-13.2h1.6v2.2c.4-.8 1-1.4 1.8-1.8s1.6-.6 2.6-.6c1.6 0 3 .4 4 1.4zm5.199 1.8c.6-1 1.2-1.8 2.2-2.4s2-.8 3.2-.8c1.6 0 3 .4 4 1.2s1.8 1.8 2 3.2h-1.8c-.2-1-.8-1.6-1.4-2.2-.8-.6-1.6-.8-2.8-.8-.8 0-1.6.2-2.4.6s-1.2 1-1.6 1.8-.6 1.8-.6 3 .2 2.2.6 3 1 1.4 1.6 1.8c.8.4 1.4.6 2.4.6 1.2 0 2-.2 2.8-.8s1.2-1.2 1.4-2.2h1.8c-.4 1.4-1 2.4-2 3.2s-2.4 1.2-4 1.2c-1.2 0-2.4-.2-3.2-.8-1-.6-1.8-1.4-2.2-2.4-.6-1-.8-2.2-.8-3.6s.2-2.6.8-3.6zm26.401 4.2h-10.8c0 1 .2 1.8.8 2.6.4.8 1 1.2 1.8 1.6s1.4.6 2.4.6 2-.2 2.8-.8 1.2-1.2 1.4-2.2h1.8c-.4 1.2-1 2.4-2 3.2s-2.4 1.2-4 1.2c-1.2 0-2.4-.2-3.4-.8s-1.8-1.4-2.2-2.4c-.6-1-.8-2.2-.8-3.6s.2-2.6.8-3.6 1.4-1.8 2.2-2.4c1-.6 2-.8 3.4-.8s2.4.2 3.2.8c1 .6 1.6 1.2 2.2 2.2s.8 2 .8 3c-.4.6-.4 1.2-.4 1.4zm-2.2-3.8a6.09 6.09 0 0 0-1.6-1.6c-.8-.4-1.4-.6-2.4-.6-1.2 0-2.4.4-3.2 1.2s-1.4 2-1.4 3.4h9.2c0-1-.2-1.8-.6-2.4zm7.001-8v17.8h-1.6V752h1.6zm3.8 7.6c.6-1 1.2-1.8 2.2-2.4s2-.8 3.2-.8 2.4.2 3.2.8c1 .6 1.6 1.4 2 2.2v-2.8h1.6v13.2h-1.6v-3c-.4.8-1 1.6-2 2.2s-2 .8-3.2.8-2.2-.2-3.2-.8-1.6-1.4-2.2-2.4-.8-2.2-.8-3.6.4-2.4.8-3.4zm10 .8c-.4-.8-1-1.4-1.8-1.8s-1.6-.6-2.4-.6c-1 0-1.8.2-2.4.6-.8.4-1.4 1-1.8 1.8s-.6 1.8-.6 2.8.2 2 .6 2.8 1 1.4 1.8 1.8 1.6.6 2.4.6 1.8-.2 2.4-.6 1.4-1 1.8-1.8.6-1.8.6-2.8c.2-1 0-2-.6-2.8zm9.999-3c1-.6 2-.8 3.2-.8s2.2.2 3.2.8 1.6 1.4 2.2 2.4.8 2.2.8 3.6-.2 2.6-.8 3.6-1.2 1.8-2.2 2.4-2 .8-3.2.8-2.4-.2-3.2-.8c-1-.6-1.6-1.4-2-2.2v2.8h-1.6v-18h1.6v7.6c.4-1 1-1.8 2-2.2zm7 3c-.4-.8-1-1.4-1.8-1.8s-1.6-.6-2.4-.6-1.8.2-2.4.6-1.4 1-1.8 1.8-.6 1.8-.6 2.8.2 2 .6 2.8 1 1.4 1.8 1.8 1.6.6 2.4.6c1 0 1.8-.2 2.4-.6s1.4-1 1.8-1.8.6-1.8.6-2.8c0-1.2-.2-2-.6-2.8zm7.202-8.4v17.8h-1.6V752h1.6zm15.599 11.8h-10.8c0 1 .2 1.8.8 2.6.4.8 1 1.2 1.8 1.6s1.4.6 2.4.6 2-.2 2.8-.8 1.2-1.2 1.4-2.2h1.8c-.4 1.2-1 2.4-2 3.2s-2.4 1.2-4 1.2c-1.2 0-2.4-.2-3.4-.8s-1.8-1.4-2.2-2.4c-.6-1-.8-2.2-.8-3.6s.2-2.6.8-3.6 1.4-1.8 2.2-2.4c1-.6 2-.8 3.4-.8s2.4.2 3.2.8c1 .6 1.6 1.2 2.2 2.2s.8 2 .8 3c-.4.6-.4 1.2-.4 1.4zm-2.2-3.8a6.09 6.09 0 0 0-1.6-1.6c-.8-.4-1.4-.6-2.4-.6-1.2 0-2.4.4-3.2 1.2s-1.4 2-1.4 3.4h9.2c0-1-.2-1.8-.6-2.4z"/>
      </g>
  </g>
  <path id="A" fill="none" d="M125 45h750s80 0 80 80v750s0 80-80 80H125s-80 0-80-80V125s0-80 80-80"/><text x="140" y="815" font-size="22" class="B F">${tokenIdentifier}</text><text x="674" y="815" font-size="22" class="B F">${
    canCancel ? "Yes" : "No"
  }</text><text x="409" y="815" font-size="22" class="B F">${durationString}</text><defs>
<linearGradient id="B" x1="1216.83" y1="-468.569" x2="-109.524" y2="1314.32" xlink:href="#P">
  <stop stop-color="${streamBaseColor}"/>
  <stop offset=".544" stop-opacity="0"/>
  <stop offset="1" stop-color="${streamBaseColorSecondary}" stop-opacity=".905"/>
</linearGradient>
<linearGradient id="C" x1="947.163" y1="418.134" x2="206.874" y2="408.316" xlink:href="#P">
  <stop stop-color="${streamBaseColor}"/>
  <stop offset="1" stop-opacity="0"/>
</linearGradient>
<linearGradient id="D" x1="265.06" y1="412.431" x2="712.363" y2="412.431" xlink:href="#P">
<stop stop-color="${streamBaseColor}"/>
  <stop offset="1" stop-opacity="0"/>
</linearGradient>
<linearGradient id="E" x1="368.08" y1="720.175" x2="126.553" y2="853.702" xlink:href="#P">
<stop stop-color="${streamBaseColor}"/>
  <stop offset=".818" stop-opacity="0"/>
</linearGradient>
<linearGradient id="F" x1="115.401" y1="794.3" x2="352.601" y2="794.3" xlink:href="#P">
<stop stop-color="${streamBaseColor}"/>
  <stop offset="1" stop-color="#0ff" stop-opacity="0"/>
</linearGradient>
<linearGradient id="G" x1="368.76" y1="868.503" x2="610.286" y2="734.976" xlink:href="#P">
<stop stop-color="${streamBaseColor}"/>
  <stop offset="1" stop-opacity="0"/>
</linearGradient>
<linearGradient id="H" x1="621.601" y1="794.3" x2="384.397" y2="794.3" xlink:href="#P">
<stop stop-color="${streamBaseColor}"/>
  <stop offset="1" stop-color="#0ff" stop-opacity="0"/>
</linearGradient>
<linearGradient id="I" x1="900.194" y1="720.123" x2="658.668" y2="853.65" xlink:href="#P">
<stop stop-color="${streamBaseColor}"/>
  <stop offset="1" stop-opacity="0"/>
</linearGradient>
<linearGradient id="J" x1="647.4" y1="794.3" x2="884.604" y2="794.3" xlink:href="#P">
<stop stop-color="${streamBaseColor}"/>
  <stop offset="1" stop-color="#0ff" stop-opacity="0"/>
</linearGradient>
<clipPath id="K">
  <path d="M0 0h1000v1000H0z" class="B"/>
</clipPath>
<path id="L" d="M332.801 852.4H135.201C124.801 852.4 116.401 844 116.401 833.6V755C116.401 744.6 124.801 736.2 135.201 736.2H332.801C343.201 736.2 351.601 744.6 351.601 755V833.6C351.601 844 343.201 852.4 332.801 852.4Z"/>
<path id="M" d="M404.201 736.2H601.801C612.201 736.2 620.601 744.6 620.601 755V833.6C620.601 844 612.201 852.4 601.801 852.4H404.201C393.801 852.4 385.401 844 385.401 833.6V755C385.201 744.6 393.801 736.2 404.201 736.2Z"/>
<path id="N" d="M864.8 852.4H667.2C656.8 852.4 648.4 844 648.4 833.6V755C648.4 744.6 656.8 736.2 667.2 736.2H864.8C875.2 736.2 883.6 744.6 883.6 755V833.6C883.8 844 875.2 852.4 864.8 852.4Z"/>
<path id="O" d="M191.398 763.8h-10.8c0 1 .2 1.8.8 2.6.4.8 1 1.2 1.8 1.6s1.4.6 2.4.6 2-.2 2.8-.8 1.2-1.2 1.4-2.2h1.8c-.4 1.2-1 2.4-2 3.2s-2.4 1.2-4 1.2c-1.2 0-2.4-.2-3.4-.8s-1.8-1.4-2.2-2.4c-.6-1-.8-2.2-.8-3.6s.2-2.6.8-3.6 1.4-1.8 2.2-2.4c1-.6 2-.8 3.4-.8s2.4.2 3.2.8c1 .6 1.6 1.2 2.2 2.2s.8 2 .8 3c-.4.6-.4 1.2-.4 1.4zm-2.2-3.8a6.09 6.09 0 0 0-1.6-1.6c-.8-.4-1.4-.6-2.4-.6-1.2 0-2.4.4-3.2 1.2s-1.4 2-1.4 3.4h9.2c0-1-.2-1.8-.6-2.4z"/>
<linearGradient id="P" gradientUnits="userSpaceOnUse"/>
</defs>
<text text-rendering="optimizeSpeed"><textPath startOffset="-100%" href="#A" class="B C D E"><animate additive="sum" attributeName="startOffset" begin="0s" dur="50s" from="0%" repeatCount="indefinite" to="100%"/>Coindrip Protocol / Token Stream #${streamId}</textPath><textPath startOffset="0%" href="#A" class="B C D E"><animate additive="sum" attributeName="startOffset" begin="0s" dur="50s" from="0%" repeatCount="indefinite" to="100%"/>Coindrip Protocol / Token Stream #${streamId}</textPath><textPath startOffset="-50%" href="#A" class="B C D E"><animate additive="sum" attributeName="startOffset" begin="0s" dur="50s" from="0%" repeatCount="indefinite" to="100%"/>Coindrip Protocol / Token Stream #${streamId}</textPath><textPath startOffset="50%" href="#A" class="B C D E"><animate additive="sum" attributeName="startOffset" begin="0s" dur="50s" from="0%" repeatCount="indefinite" to="100%"/>Coindrip Protocol / Token Stream #${streamId}</textPath></text></svg>
  `);
};

const seedRand = async (hash: string, range: [number, number]) => {
  const res = await crypto.subtle.digest("SHA-256", Buffer.from(hash));
  const seed = new Uint32Array(res)[0];
  const rng = prand.xoroshiro128plus(seed);
  return prand.unsafeUniformIntDistribution(range[0], range[1], rng);
};

async function generateRandomHSLColor(seed: string, alpha = 1) {
  // Generate random values for H, S, and L within a reasonable range
  const randomH = await seedRand(seed, [0, 360]);
  const randomS = await seedRand(seed, [90, 100]);
  const randomL = await seedRand(seed, [40, 60]);

  // Convert the random values back to HSL string
  const randomHSL = `hsla(${randomH}, ${randomS}%, ${randomL}%, ${alpha})`;

  return randomHSL;
}
