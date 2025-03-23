import prand from "pure-rand";
import svgSlim from "svg-slimming";
import { denominate } from "./economics";

export const generateNftSvg = async (
  seed: string,
  streamId: string,
  tokenIdentifier: string,
  balance: number,
  decimals: number,
  duration: number,
  percent: number
): Promise<string> => {
  const streamBaseColor = await generateRandomHSLColor(seed);
  const streamBaseColorSecondary = await generateRandomHSLColor(seed, 0.6);
  const streamBaseColorProgressBar = await generateRandomHSLColor(seed, 0.4);
  const streamBaseColorProgressBarSecondary = await generateRandomHSLColor(seed, 0.15);

  const durationString = duration === 0 ? "&lt; 1 Day" : duration === 1 ? "1 Day" : `${duration} Days`;

  const progressWidth = (percent / 100) * 550;
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
        <text x="140" y="770" font-size="22" class="F">Token</text>
        <text x="409" y="770" font-size="22" class="F">Duration</text>
        <text x="674" y="770" font-size="22" class="F">Balance</text>
      </g>
  </g>
  
    <!-- Progress bar background -->
  <rect x="225" y="880" width="550" height="10" rx="7" ry="7" fill="${streamBaseColorProgressBarSecondary}"/>
  <!-- Progress bar fill -->
  <rect x="225" y="880" width="${progressWidth}" rx="7" ry="7" height="10" fill="${streamBaseColorProgressBar}"/>

  <path id="A" fill="none" d="M125 45h750s80 0 80 80v750s0 80-80 80H125s-80 0-80-80V125s0-80 80-80"/><text x="140" y="815" font-size="22" class="B F">${tokenIdentifier}</text><text x="674" y="815" font-size="22" class="B F">${denominate(balance, 1, decimals)}</text><text x="409" y="815" font-size="22" class="B F">${durationString}</text><defs>
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
<text text-rendering="optimizeSpeed"><textPath startOffset="-100%" href="#A" class="B C D E"><animate additive="sum" attributeName="startOffset" begin="0s" dur="50s" from="0%" repeatCount="indefinite" to="100%"/>Coindrip Protocol / Token Stream / ${streamId}</textPath><textPath startOffset="0%" href="#A" class="B C D E"><animate additive="sum" attributeName="startOffset" begin="0s" dur="50s" from="0%" repeatCount="indefinite" to="100%"/>Coindrip Protocol / Token Stream / ${streamId}</textPath><textPath startOffset="-50%" href="#A" class="B C D E"><animate additive="sum" attributeName="startOffset" begin="0s" dur="50s" from="0%" repeatCount="indefinite" to="100%"/>Coindrip Protocol / Token Stream / ${streamId}</textPath><textPath startOffset="50%" href="#A" class="B C D E"><animate additive="sum" attributeName="startOffset" begin="0s" dur="50s" from="0%" repeatCount="indefinite" to="100%"/>Coindrip Protocol / Token Stream / ${streamId}</textPath></text></svg>
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
