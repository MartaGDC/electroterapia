import "./ImagetDCS.css";
import { PositionsTDCS } from "../../constants/interfaces";
import { useEffect } from "react";

const ImageTDCS: React.FC<{
  type: "aprendizaje" | "simulacion" | "visualizador";
  elecSelected: "catodo" | "anodo" | null;
  catodoTDCS: PositionsTDCS | null;
  anodoTDCS: PositionsTDCS | null;
  setCatodoTDCS: React.Dispatch<React.SetStateAction<PositionsTDCS | null>>;
  setAnodoTDCS: React.Dispatch<React.SetStateAction<PositionsTDCS | null>>;
}> = ({
  type, elecSelected, catodoTDCS, anodoTDCS, setCatodoTDCS, setAnodoTDCS
}) => {

  const disabledAprendizaje = [
    PositionsTDCS.F7, PositionsTDCS.F8, PositionsTDCS.T3, PositionsTDCS.T4, 
    PositionsTDCS.A1, PositionsTDCS.A2, PositionsTDCS.T5, PositionsTDCS.T6, 
    PositionsTDCS.P3, PositionsTDCS.P4, PositionsTDCS.PZ, PositionsTDCS.CZ, 
    PositionsTDCS.FZ, PositionsTDCS.O1, PositionsTDCS.O2,
  ]

  const setElectrodo = (position: PositionsTDCS) => {
    if (type == "aprendizaje" && disabledAprendizaje.includes(position)) return;
    
    if (elecSelected == "catodo" && position != anodoTDCS) setCatodoTDCS(position);
    else if (elecSelected == "anodo" && position != catodoTDCS) setAnodoTDCS(position);
  }

  const classNameElec = (position: PositionsTDCS) => {
    if (type == "aprendizaje" && disabledAprendizaje.includes(position)) return "disabled-elec";
    return `circ-elec${(catodoTDCS == position ? "-catodo" : (anodoTDCS == position ? "-anodo" : ""))}`;
  }

  const classNameText = (position: PositionsTDCS) => {
    if (type == "aprendizaje" && disabledAprendizaje.includes(position)) return "text-elec";
    return `text-elec${(catodoTDCS == position ? "-catodo" : (anodoTDCS == position ? "-anodo" : ""))}`;
  }

  return (
    <svg 
      className="tdcs"
      width="100%"
      height="100%"
      viewBox="0 0 700 700"
      preserveAspectRatio="xMidYMid meet"
    >
      <g id="Capa 1" data-inkscape-label="Capa 1" data-inkscape-groupmode="layer">
        <path stroke="#000000" strokeWidth="2.2" d="M304.83+620.452C221.631+404.329+209.428+301.913+308.391+80.5073" fill="none" strokeLinecap="round" opacity="1" strokeLinejoin="round" strokeDasharray="8,12"/>
        <path stroke="#000000" strokeWidth="2.2" d="M402.9+83.2115C486.099+299.335+498.302+401.751+399.339+623.157" fill="none" strokeLinecap="round" opacity="1" strokeLinejoin="round" strokeDasharray="8,12"/>
        <path stroke="#000000" strokeWidth="2.2" d="M578.391+194.798C453.148+249.619+335.588+284.725+126.17+202.779" fill="none" strokeLinecap="round" opacity="1" strokeLinejoin="round" strokeDasharray="8,12"/>
        <path stroke="#000000" strokeWidth="2.2" d="M130.817+511.579C256.546+457.882+374.417+423.831+583.091+507.65" fill="none" strokeLinecap="round" opacity="1" strokeLinejoin="round" strokeDasharray="8,12"/>
        <path stroke="#000000" strokeWidth="2.2" d="M133.557+356.513C133.557+234.078+232.81+134.825+355.245+134.825C477.681+134.825+576.934+234.078+576.934+356.513C576.934+478.949+477.681+578.202+355.245+578.202C232.81+578.202+133.557+478.949+133.557+356.513Z" fill="none" strokeLinecap="round" opacity="1" strokeLinejoin="round" strokeDasharray="8,12"/>
        <path stroke="#000000" strokeWidth="2.2" d="M624.268+357.485L84.3038+358.022" fill="none" strokeLinecap="round" opacity="1" strokeLinejoin="round" strokeDasharray="8,12"/>
        <path stroke="#000000" strokeWidth="2.2" d="M353.48+80.2495L353.535+623.604" fill="none" strokeLinecap="round" opacity="1" strokeLinejoin="round" strokeDasharray="8,12"/>
        
        {/* CZ */}
        <path className={classNameElec(PositionsTDCS.CZ)} onClick={() => setElectrodo(PositionsTDCS.CZ)} stroke="#000000" strokeWidth="3" d="M322.678+356.594C322.678+340.313+335.876+327.115+352.156+327.115C368.437+327.115+381.635+340.313+381.635+356.594C381.635+372.874+368.437+386.072+352.156+386.072C335.876+386.072+322.678+372.874+322.678+356.594Z" fill="#ffffff" strokeLinecap="round" opacity="1" strokeLinejoin="round"/>
        {/* C4 */}
        <path className={classNameElec(PositionsTDCS.C4)} onClick={() => setElectrodo(PositionsTDCS.C4)} stroke="#000000" strokeWidth="3" d="M432.064+358.209C432.064+341.929+445.262+328.731+461.542+328.731C477.823+328.731+491.021+341.929+491.021+358.209C491.021+374.49+477.823+387.688+461.542+387.688C445.262+387.688+432.064+374.49+432.064+358.209Z" fill="#ffffff" strokeLinecap="round" opacity="1" strokeLinejoin="round"/>
        {/* T4 */}
        <path className={classNameElec(PositionsTDCS.T4)} onClick={() => setElectrodo(PositionsTDCS.T4)} stroke="#000000" strokeWidth="3" d="M542.718+356.021C542.718+339.741+555.916+326.543+572.196+326.543C588.477+326.543+601.675+339.741+601.675+356.021C601.675+372.302+588.477+385.5+572.196+385.5C555.916+385.5+542.718+372.302+542.718+356.021Z" fill="#ffffff" strokeLinecap="round" opacity="1" strokeLinejoin="round"/>
        {/* C3 */}
        <path className={classNameElec(PositionsTDCS.C3)} onClick={() => setElectrodo(PositionsTDCS.C3)} stroke="#000000" strokeWidth="3" d="M214.049+357.003C214.049+340.723+227.246+327.525+243.527+327.525C259.807+327.525+273.005+340.723+273.005+357.003C273.005+373.284+259.807+386.481+243.527+386.481C227.246+386.481+214.049+373.284+214.049+357.003Z" fill="#ffffff" strokeLinecap="round" opacity="1" strokeLinejoin="round"/>
        {/* A2 */}
        <path className={classNameElec(PositionsTDCS.A2)} onClick={() => setElectrodo(PositionsTDCS.A2)} stroke="#000000" strokeWidth="3" d="M630.68+358.544C630.68+342.263+643.878+329.065+660.158+329.065C676.439+329.065+689.637+342.263+689.637+358.544C689.637+374.824+676.439+388.022+660.158+388.022C643.878+388.022+630.68+374.824+630.68+358.544Z" fill="none" strokeLinecap="round" opacity="1" strokeLinejoin="round"/>
        {/* A1 */}
        <path className={classNameElec(PositionsTDCS.A1)} onClick={() => setElectrodo(PositionsTDCS.A1)} stroke="#000000" strokeWidth="3" d="M21.5531+351.778C21.5531+335.498+34.751+322.3+51.0315+322.3C67.312+322.3+80.51+335.498+80.51+351.778C80.51+368.059+67.312+381.257+51.0315+381.257C34.751+381.257+21.5531+368.059+21.5531+351.778Z" fill="none" strokeLinecap="round" opacity="1" strokeLinejoin="round"/>
        {/* F7 */}
        <path className={classNameElec(PositionsTDCS.F7)} onClick={() => setElectrodo(PositionsTDCS.F7)} stroke="#000000" strokeWidth="3" d="M145.358+231.257C145.358+214.977+158.556+201.779+174.836+201.779C191.117+201.779+204.315+214.977+204.315+231.257C204.315+247.538+191.117+260.736+174.836+260.736C158.556+260.736+145.358+247.538+145.358+231.257Z" fill="#ffffff" strokeLinecap="round" opacity="1" strokeLinejoin="round"/>
        {/* T3 */}
        <path className={classNameElec(PositionsTDCS.T3)} onClick={() => setElectrodo(PositionsTDCS.T3)} stroke="#000000" strokeWidth="3" d="M104.499+355.858C104.499+339.578+117.697+326.38+133.977+326.38C150.258+326.38+163.456+339.578+163.456+355.858C163.456+372.139+150.258+385.337+133.977+385.337C117.697+385.337+104.499+372.139+104.499+355.858Z" fill="#ffffff" strokeLinecap="round" opacity="1" strokeLinejoin="round"/>
        {/* T5 */}
        <path className={classNameElec(PositionsTDCS.T5)} onClick={() => setElectrodo(PositionsTDCS.T5)} stroke="#000000" strokeWidth="3" d="M146.339+483.915C146.339+467.634+159.537+454.437+175.818+454.437C192.098+454.437+205.296+467.634+205.296+483.915C205.296+500.195+192.098+513.393+175.818+513.393C159.537+513.393+146.339+500.195+146.339+483.915Z" fill="#ffffff" strokeLinecap="round" opacity="1" strokeLinejoin="round"/>
        {/* O1 */}
        <path className={classNameElec(PositionsTDCS.O1)} onClick={() => setElectrodo(PositionsTDCS.O1)} stroke="#000000" strokeWidth="3" d="M253.824+564.774C253.824+548.493+267.022+535.295+283.302+535.295C299.583+535.295+312.781+548.493+312.781+564.774C312.781+581.054+299.583+594.252+283.302+594.252C267.022+594.252+253.824+581.054+253.824+564.774Z" fill="#ffffff" strokeLinecap="round" opacity="1" strokeLinejoin="round"/>
        {/* O2 */}
        <path className={classNameElec(PositionsTDCS.O2)} onClick={() => setElectrodo(PositionsTDCS.O2)} stroke="#000000" strokeWidth="3" d="M393.005+565.755C393.005+549.475+406.203+536.277+422.484+536.277C438.764+536.277+451.962+549.475+451.962+565.755C451.962+582.036+438.764+595.234+422.484+595.234C406.203+595.234+393.005+582.036+393.005+565.755Z" fill="#ffffff" strokeLinecap="round" opacity="1" strokeLinejoin="round"/>
        {/* T6 */}
        <path className={classNameElec(PositionsTDCS.T6)} onClick={() => setElectrodo(PositionsTDCS.T6)} stroke="#000000" strokeWidth="3" d="M501.124+483.056C501.124+466.776+514.322+453.578+530.602+453.578C546.883+453.578+560.081+466.776+560.081+483.056C560.081+499.337+546.883+512.535+530.602+512.535C514.322+512.535+501.124+499.337+501.124+483.056Z" fill="#ffffff" strokeLinecap="round" opacity="1" strokeLinejoin="round"/>
        {/* P4 */}
        <path className={classNameElec(PositionsTDCS.P4)} onClick={() => setElectrodo(PositionsTDCS.P4)} stroke="#000000" strokeWidth="3" d="M413.987+469.457C413.987+453.177+427.185+439.979+443.465+439.979C459.746+439.979+472.944+453.177+472.944+469.457C472.944+485.738+459.746+498.936+443.465+498.936C427.185+498.936+413.987+485.738+413.987+469.457Z" fill="#ffffff" strokeLinecap="round" opacity="1" strokeLinejoin="round"/>
        {/* Pz */}
        <path className={classNameElec(PositionsTDCS.PZ)} onClick={() => setElectrodo(PositionsTDCS.PZ)} stroke="#000000" strokeWidth="3" d="M323.681+468.537C323.681+452.257+336.879+439.059+353.159+439.059C369.44+439.059+382.638+452.257+382.638+468.537C382.638+484.818+369.44+498.016+353.159+498.016C336.879+498.016+323.681+484.818+323.681+468.537Z" fill="#ffffff" strokeLinecap="round" opacity="1" strokeLinejoin="round"/>
        {/* P3 */}
        <path className={classNameElec(PositionsTDCS.P3)} onClick={() => setElectrodo(PositionsTDCS.P3)} stroke="#000000" strokeWidth="3" d="M234.581+468.823C234.581+452.543+247.779+439.345+264.059+439.345C280.34+439.345+293.538+452.543+293.538+468.823C293.538+485.104+280.34+498.302+264.059+498.302C247.779+498.302+234.581+485.104+234.581+468.823Z" fill="#ffffff" strokeLinecap="round" opacity="1" strokeLinejoin="round"/>
        {/* F4 */}
        <path className={classNameElec(PositionsTDCS.F4)} onClick={() => setElectrodo(PositionsTDCS.F4)} stroke="#000000" strokeWidth="3" d="M413.701+245.389C413.701+229.108+426.899+215.91+443.179+215.91C459.46+215.91+472.658+229.108+472.658+245.389C472.658+261.669+459.46+274.867+443.179+274.867C426.899+274.867+413.701+261.669+413.701+245.389Z" fill="#ffffff" strokeLinecap="round" opacity="1" strokeLinejoin="round"/>
        {/* Fz */}
        <path className={classNameElec(PositionsTDCS.FZ)} onClick={() => setElectrodo(PositionsTDCS.FZ)} stroke="#000000" strokeWidth="3" d="M322.76+247.004C322.76+230.724+335.958+217.526+352.239+217.526C368.519+217.526+381.717+230.724+381.717+247.004C381.717+263.285+368.519+276.483+352.239+276.483C335.958+276.483+322.76+263.285+322.76+247.004Z" fill="#ffffff" strokeLinecap="round" opacity="1" strokeLinejoin="round"/>
        {/* Fp2 */}
        <path className={classNameElec(PositionsTDCS.FP2)} onClick={() => setElectrodo(PositionsTDCS.FP2)} stroke="#000000" strokeWidth="3" d="M395.378+150.992C395.378+134.712+408.576+121.514+424.856+121.514C441.137+121.514+454.335+134.712+454.335+150.992C454.335+167.273+441.137+180.471+424.856+180.471C408.576+180.471+395.378+167.273+395.378+150.992Z" fill="#ffffff" strokeLinecap="round" opacity="1" strokeLinejoin="round"/>
        {/* F8 */}
        <path className={classNameElec(PositionsTDCS.F8)} onClick={() => setElectrodo(PositionsTDCS.F8)} stroke="#000000" strokeWidth="3" d="M500.326+229.315C500.326+213.035+513.524+199.837+529.805+199.837C546.085+199.837+559.283+213.035+559.283+229.315C559.283+245.596+546.085+258.794+529.805+258.794C513.524+258.794+500.326+245.596+500.326+229.315Z" fill="#ffffff" strokeLinecap="round" opacity="1" strokeLinejoin="round"/>
        {/* Fp1 */}
        <path className={classNameElec(PositionsTDCS.FP1)} onClick={() => setElectrodo(PositionsTDCS.FP1)} stroke="#000000" strokeWidth="3" d="M253.436+151.688C253.436+135.407+266.634+122.209+282.914+122.209C299.195+122.209+312.393+135.407+312.393+151.688C312.393+167.968+299.195+181.166+282.914+181.166C266.634+181.166+253.436+167.968+253.436+151.688Z" fill="#ffffff" strokeLinecap="round" opacity="1" strokeLinejoin="round"/>
        {/* F3 */}
        <path className={classNameElec(PositionsTDCS.F3)} onClick={() => setElectrodo(PositionsTDCS.F3)} stroke="#000000" strokeWidth="3" d="M233.497+247.127C233.497+230.847+246.695+217.649+262.976+217.649C279.256+217.649+292.454+230.847+292.454+247.127C292.454+263.408+279.256+276.606+262.976+276.606C246.695+276.606+233.497+263.408+233.497+247.127Z" fill="#ffffff" strokeLinecap="round" opacity="1" strokeLinejoin="round"/>

        <path stroke="#000000" strokeWidth="3" d="M80.6212+352.076C80.6212+200.405+203.575+77.4519+355.245+77.4519C506.916+77.4519+629.87+200.405+629.87+352.076C629.87+503.747+506.916+626.7+355.245+626.7C203.575+626.7+80.6212+503.747+80.6212+352.076Z" fill="none" strokeLinecap="round" opacity="1" strokeLinejoin="round"/>
        <path stroke="#000000" strokeWidth="3" d="M307.674+80.3709C307.135+80.9108+308.395+78.6242+308.486+78.2603C308.871+76.7209+310.458+74.5025+311.571+73.3898C315.348+69.6126+321.75+70.1795+325.695+67.2205C336.485+59.1286+338.818+38.4938+351.509+34.2634C367.139+29.0534+374.254+57.8288+380.083+66.5711C382.76+70.5872+388.917+69.137+392.908+70.4675C397.226+71.9066+400.419+78.3033+403.461+81.345" fill="#000000" strokeLinecap="round" fillOpacity="0.00170068" opacity="1" strokeLinejoin="round"/>
        
        <text className={classNameText(PositionsTDCS.FP2)} pointerEvents="none" x="0" style={{fontFamily:"'Avenir-Medium', 'Avenir'"}} y="0" textAnchor="middle" data-inkpad-text="Fp2" fill="#000000" fontSize="25" data-inkpad-width="45" opacity="1" transform="matrix(1 0 0 1 402.595 133.644)">
          <tspan x="22.5" y="25" textLength="43.525"> Fp2 </tspan>
        </text>
        <text className={classNameText(PositionsTDCS.FP1)} pointerEvents="none" x="0" style={{fontFamily:"'Avenir-Medium', 'Avenir'"}} y="0" textAnchor="middle" data-inkpad-text="Fp1" fill="#000000" fontSize="25" data-inkpad-width="45" opacity="1" transform="matrix(1 0 0 1 260.868 134.553)">
          <tspan x="22.5" y="25" textLength="43.525"> Fp1</tspan>
        </text>
        <text className={classNameText(PositionsTDCS.F4)} pointerEvents="none" x="0" style={{fontFamily:"'Avenir-Medium', 'Avenir'"}} y="0" textAnchor="middle" data-inkpad-text="F4" fill="#000000" fontSize="25" data-inkpad-width="45" opacity="1" transform="matrix(1 0 0 1 421.531 230.963)">
          <tspan x="22.5" y="25" textLength="28.25"> F4</tspan>
        </text>
        <text className={classNameText(PositionsTDCS.F8)} pointerEvents="none" x="0" style={{fontFamily:"'Avenir-Medium', 'Avenir'"}} y="0" textAnchor="middle" data-inkpad-text="F8" fill="#000000" fontSize="25" data-inkpad-width="45" opacity="1" transform="matrix(1 0 0 1 506.791 213.368)">
          <tspan x="22.5" y="25" textLength="28.25"> F8</tspan>
        </text>
        <text className={classNameText(PositionsTDCS.FZ)} pointerEvents="none" x="0" style={{fontFamily:"'Avenir-Medium', 'Avenir'"}} y="0" textAnchor="middle" data-inkpad-text="Fz" fill="#000000" fontSize="25" data-inkpad-width="45" opacity="1" transform="matrix(1 0 0 1 331.365 231.949)">
          <tspan x="22.5" y="25" textLength="25.925"> Fz</tspan>
        </text>
        <text className={classNameText(PositionsTDCS.F3)} pointerEvents="none" x="0" style={{fontFamily:"'Avenir-Medium', 'Avenir'"}} y="0" textAnchor="middle" data-inkpad-text="F3" fill="#000000" fontSize="25" data-inkpad-width="45" opacity="1" transform="matrix(1 0 0 1 239.997 231.378)">
          <tspan x="22.5" y="25" textLength="28.25"> F3</tspan>
        </text>
        <text className={classNameText(PositionsTDCS.F7)} pointerEvents="none" x="0" style={{fontFamily:"'Avenir-Medium', 'Avenir'"}} y="0" textAnchor="middle" data-inkpad-text="F7" fill="#000000" fontSize="25" data-inkpad-width="45" opacity="1" transform="matrix(1 0 0 1 153.595 213.427)">
          <tspan x="22.5" y="25" textLength="28.25"> F7</tspan>
        </text>
        <text className={classNameText(PositionsTDCS.A1)} pointerEvents="none" x="0" style={{fontFamily:"'Avenir-Medium', 'Avenir'"}} y="0" textAnchor="middle" data-inkpad-text="A1" fill="#000000" fontSize="25" data-inkpad-width="45" opacity="1" transform="matrix(1 0 0 1 26.6144 335.429)">
          <tspan x="22.5" y="25" textLength="31.5"> A1</tspan>
        </text>
        <text className={classNameText(PositionsTDCS.A2)} pointerEvents="none" x="0" style={{fontFamily:"'Avenir-Medium', 'Avenir'"}} y="0" textAnchor="middle" data-inkpad-text="A2" fill="#000000" fontSize="25" data-inkpad-width="45" opacity="1" transform="matrix(1 0 0 1 637.216 340.505)">
          <tspan x="22.5" y="25" textLength="31.5"> A2</tspan>
        </text>
        <text className={classNameText(PositionsTDCS.T4)} pointerEvents="none" x="0" style={{fontFamily:"'Avenir-Medium', 'Avenir'"}} y="0" textAnchor="middle" data-inkpad-text="T4" fill="#000000" fontSize="25" data-inkpad-width="45" opacity="1" transform="matrix(1 0 0 1 550.909 340.125)">
          <tspan x="22.5" y="25" textLength="28.25"> T4</tspan>
        </text>
        <text className={classNameText(PositionsTDCS.T6)} pointerEvents="none" x="0" style={{fontFamily:"'Avenir-Medium', 'Avenir'"}} y="0" textAnchor="middle" data-inkpad-text="T6" fill="#000000" fontSize="25" data-inkpad-width="45" opacity="1" transform="matrix(1 0 0 1 506.713 468.655)">
          <tspan x="22.5" y="25" textLength="28.25"> T6</tspan>
        </text>
        <text className={classNameText(PositionsTDCS.O2)} pointerEvents="none" x="0" style={{fontFamily:"'Avenir-Medium', 'Avenir'"}} y="0" textAnchor="middle" data-inkpad-text="O2" fill="#000000" fontSize="25" data-inkpad-width="45" opacity="1" transform="matrix(1 0 0 1 398.675 549.659)">
          <tspan x="22.5" y="25" textLength="34.7"> O2</tspan>
        </text>
        <text className={classNameText(PositionsTDCS.O1)} pointerEvents="none" x="0" style={{fontFamily:"'Avenir-Medium', 'Avenir'"}} y="0" textAnchor="middle" data-inkpad-text="O1" fill="#000000" fontSize="25" data-inkpad-width="45" opacity="1" transform="matrix(1 0 0 1 260.845 548.379)">
          <tspan x="22.5" y="25" textLength="34.7"> O1</tspan>
        </text>
        <text className={classNameText(PositionsTDCS.P4)} pointerEvents="none" x="0" style={{fontFamily:"'Avenir-Medium', 'Avenir'"}} y="0" textAnchor="middle" data-inkpad-text="P4" fill="#000000" fontSize="25" data-inkpad-width="45" opacity="1" transform="matrix(1 0 0 1 420.449 452.617)">
          <tspan x="22.5" y="25" textLength="28.725"> P4</tspan>
        </text>
        <text className={classNameText(PositionsTDCS.PZ)} pointerEvents="none" x="0" style={{fontFamily:"'Avenir-Medium', 'Avenir'"}} y="0" textAnchor="middle" data-inkpad-text="Pz" fill="#000000" fontSize="25" data-inkpad-width="45" opacity="1" transform="matrix(1 0 0 1 332.982 452.045)">
          <tspan x="22.5" y="25" textLength="26.4"> Pz</tspan>
        </text>
        <text className={classNameText(PositionsTDCS.P3)} pointerEvents="none" x="0" style={{fontFamily:"'Avenir-Medium', 'Avenir'"}} y="0" textAnchor="middle" data-inkpad-text="P3" fill="#000000" fontSize="25" data-inkpad-width="45" opacity="1" transform="matrix(1 0 0 1 241.831 453.11)">
          <tspan x="22.5" y="25" textLength="28.725"> P3</tspan>
        </text>
        <text className={classNameText(PositionsTDCS.T5)} pointerEvents="none" x="0" style={{fontFamily:"'Avenir-Medium', 'Avenir'"}} y="0" textAnchor="middle" data-inkpad-text="T5" fill="#000000" fontSize="25" data-inkpad-width="45" opacity="1" transform="matrix(1 0 0 1 152.531 469.503)">
          <tspan x="22.5" y="25" textLength="28.25"> T5</tspan>
        </text>
        <text className={classNameText(PositionsTDCS.C4)} pointerEvents="none" x="0" style={{fontFamily:"'Avenir-Medium', 'Avenir'"}} y="0" textAnchor="middle" data-inkpad-text="C4" fill="#000000" fontSize="25" data-inkpad-width="45" opacity="1" transform="matrix(1 0 0 1 438.441 341.651)">
          <tspan x="22.5" y="25" textLength="31.5"> C4</tspan>
        </text>
        <text className={classNameText(PositionsTDCS.CZ)} pointerEvents="none" x="0" style={{fontFamily:"'Avenir-Medium', 'Avenir'"}} y="0" textAnchor="middle" data-inkpad-text="Cz" fill="#000000" fontSize="25" data-inkpad-width="45" opacity="1" transform="matrix(1 0 0 1 328.944 339.27)">
          <tspan x="22.5" y="25" textLength="29.175"> Cz</tspan>
        </text>
        <text className={classNameText(PositionsTDCS.C3)} pointerEvents="none" x="0" style={{fontFamily:"'Avenir-Medium', 'Avenir'"}} y="0" textAnchor="middle" data-inkpad-text="C3" fill="#000000" fontSize="25" data-inkpad-width="45" opacity="1" transform="matrix(1 0 0 1 219.638 341.376)">
          <tspan x="22.5" y="25" textLength="31.5"> C3</tspan>
        </text>
        <text className={classNameText(PositionsTDCS.T3)} pointerEvents="none" x="0" style={{fontFamily:"'Avenir-Medium', 'Avenir'"}} y="0" textAnchor="middle" data-inkpad-text="T3" fill="#000000" fontSize="25" data-inkpad-width="45" opacity="1" transform="matrix(1 0 0 1 107.896 338.672)">
          <tspan x="22.5" y="25" textLength="28.25"> T3</tspan>
        </text>
      </g>
    </svg>
  )
}

export default ImageTDCS;