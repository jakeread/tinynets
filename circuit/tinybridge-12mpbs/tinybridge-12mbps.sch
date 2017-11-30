<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE eagle SYSTEM "eagle.dtd">
<eagle version="8.3.2">
<drawing>
<settings>
<setting alwaysvectorfont="no"/>
<setting verticaltext="up"/>
</settings>
<grid distance="0.1" unitdist="inch" unit="inch" style="lines" multiple="1" display="yes" altdistance="0.01" altunitdist="inch" altunit="inch"/>
<layers>
<layer number="1" name="Top" color="4" fill="1" visible="no" active="no"/>
<layer number="16" name="Bottom" color="1" fill="1" visible="no" active="no"/>
<layer number="17" name="Pads" color="2" fill="1" visible="no" active="no"/>
<layer number="18" name="Vias" color="2" fill="1" visible="no" active="no"/>
<layer number="19" name="Unrouted" color="6" fill="1" visible="no" active="no"/>
<layer number="20" name="Dimension" color="24" fill="1" visible="no" active="no"/>
<layer number="21" name="tPlace" color="7" fill="1" visible="no" active="no"/>
<layer number="22" name="bPlace" color="7" fill="1" visible="no" active="no"/>
<layer number="23" name="tOrigins" color="15" fill="1" visible="no" active="no"/>
<layer number="24" name="bOrigins" color="15" fill="1" visible="no" active="no"/>
<layer number="25" name="tNames" color="7" fill="1" visible="no" active="no"/>
<layer number="26" name="bNames" color="7" fill="1" visible="no" active="no"/>
<layer number="27" name="tValues" color="7" fill="1" visible="no" active="no"/>
<layer number="28" name="bValues" color="7" fill="1" visible="no" active="no"/>
<layer number="29" name="tStop" color="7" fill="3" visible="no" active="no"/>
<layer number="30" name="bStop" color="7" fill="6" visible="no" active="no"/>
<layer number="31" name="tCream" color="7" fill="4" visible="no" active="no"/>
<layer number="32" name="bCream" color="7" fill="5" visible="no" active="no"/>
<layer number="33" name="tFinish" color="6" fill="3" visible="no" active="no"/>
<layer number="34" name="bFinish" color="6" fill="6" visible="no" active="no"/>
<layer number="35" name="tGlue" color="7" fill="4" visible="no" active="no"/>
<layer number="36" name="bGlue" color="7" fill="5" visible="no" active="no"/>
<layer number="37" name="tTest" color="7" fill="1" visible="no" active="no"/>
<layer number="38" name="bTest" color="7" fill="1" visible="no" active="no"/>
<layer number="39" name="tKeepout" color="4" fill="11" visible="no" active="no"/>
<layer number="40" name="bKeepout" color="1" fill="11" visible="no" active="no"/>
<layer number="41" name="tRestrict" color="4" fill="10" visible="no" active="no"/>
<layer number="42" name="bRestrict" color="1" fill="10" visible="no" active="no"/>
<layer number="43" name="vRestrict" color="2" fill="10" visible="no" active="no"/>
<layer number="44" name="Drills" color="7" fill="1" visible="no" active="no"/>
<layer number="45" name="Holes" color="7" fill="1" visible="no" active="no"/>
<layer number="46" name="Milling" color="3" fill="1" visible="no" active="no"/>
<layer number="47" name="Measures" color="7" fill="1" visible="no" active="no"/>
<layer number="48" name="Document" color="7" fill="1" visible="no" active="no"/>
<layer number="49" name="Reference" color="7" fill="1" visible="no" active="no"/>
<layer number="50" name="dxf" color="7" fill="1" visible="no" active="no"/>
<layer number="51" name="tDocu" color="7" fill="1" visible="no" active="no"/>
<layer number="52" name="bDocu" color="7" fill="1" visible="no" active="no"/>
<layer number="53" name="tGND_GNDA" color="7" fill="9" visible="no" active="no"/>
<layer number="54" name="bGND_GNDA" color="1" fill="9" visible="no" active="no"/>
<layer number="56" name="wert" color="7" fill="1" visible="no" active="no"/>
<layer number="57" name="tCAD" color="7" fill="1" visible="no" active="no"/>
<layer number="59" name="tCarbon" color="7" fill="1" visible="no" active="no"/>
<layer number="60" name="bCarbon" color="7" fill="1" visible="no" active="no"/>
<layer number="90" name="Modules" color="5" fill="1" visible="yes" active="yes"/>
<layer number="91" name="Nets" color="2" fill="1" visible="yes" active="yes"/>
<layer number="92" name="Busses" color="1" fill="1" visible="yes" active="yes"/>
<layer number="93" name="Pins" color="2" fill="1" visible="no" active="yes"/>
<layer number="94" name="Symbols" color="4" fill="1" visible="yes" active="yes"/>
<layer number="95" name="Names" color="7" fill="1" visible="yes" active="yes"/>
<layer number="96" name="Values" color="7" fill="1" visible="yes" active="yes"/>
<layer number="97" name="Info" color="7" fill="1" visible="yes" active="yes"/>
<layer number="98" name="Guide" color="6" fill="1" visible="yes" active="yes"/>
<layer number="99" name="SpiceOrder" color="7" fill="1" visible="yes" active="yes"/>
<layer number="100" name="Muster" color="7" fill="1" visible="no" active="no"/>
<layer number="101" name="Patch_Top" color="12" fill="4" visible="yes" active="yes"/>
<layer number="102" name="Vscore" color="7" fill="1" visible="yes" active="yes"/>
<layer number="103" name="tMap" color="7" fill="1" visible="yes" active="yes"/>
<layer number="104" name="Name" color="16" fill="1" visible="yes" active="yes"/>
<layer number="105" name="tPlate" color="7" fill="1" visible="yes" active="yes"/>
<layer number="106" name="bPlate" color="7" fill="1" visible="yes" active="yes"/>
<layer number="107" name="Crop" color="7" fill="1" visible="yes" active="yes"/>
<layer number="108" name="tplace-old" color="10" fill="1" visible="yes" active="yes"/>
<layer number="109" name="ref-old" color="11" fill="1" visible="yes" active="yes"/>
<layer number="110" name="fp0" color="7" fill="1" visible="yes" active="yes"/>
<layer number="111" name="LPC17xx" color="7" fill="1" visible="yes" active="yes"/>
<layer number="112" name="tSilk" color="7" fill="1" visible="yes" active="yes"/>
<layer number="113" name="IDFDebug" color="4" fill="1" visible="yes" active="yes"/>
<layer number="114" name="Badge_Outline" color="7" fill="1" visible="yes" active="yes"/>
<layer number="115" name="ReferenceISLANDS" color="7" fill="1" visible="yes" active="yes"/>
<layer number="116" name="Patch_BOT" color="9" fill="4" visible="yes" active="yes"/>
<layer number="118" name="Rect_Pads" color="7" fill="1" visible="yes" active="yes"/>
<layer number="121" name="_tsilk" color="7" fill="1" visible="yes" active="yes"/>
<layer number="122" name="_bsilk" color="7" fill="1" visible="yes" active="yes"/>
<layer number="123" name="tTestmark" color="7" fill="1" visible="yes" active="yes"/>
<layer number="124" name="bTestmark" color="7" fill="1" visible="yes" active="yes"/>
<layer number="125" name="_tNames" color="7" fill="1" visible="yes" active="yes"/>
<layer number="126" name="_bNames" color="7" fill="1" visible="yes" active="yes"/>
<layer number="127" name="_tValues" color="7" fill="1" visible="yes" active="yes"/>
<layer number="128" name="_bValues" color="7" fill="1" visible="yes" active="yes"/>
<layer number="129" name="Mask" color="7" fill="1" visible="yes" active="yes"/>
<layer number="131" name="tAdjust" color="7" fill="1" visible="yes" active="yes"/>
<layer number="132" name="bAdjust" color="7" fill="1" visible="yes" active="yes"/>
<layer number="144" name="Drill_legend" color="7" fill="1" visible="yes" active="yes"/>
<layer number="150" name="Notes" color="7" fill="1" visible="yes" active="yes"/>
<layer number="151" name="HeatSink" color="7" fill="1" visible="yes" active="yes"/>
<layer number="152" name="_bDocu" color="7" fill="1" visible="yes" active="yes"/>
<layer number="153" name="FabDoc1" color="7" fill="1" visible="yes" active="yes"/>
<layer number="154" name="FabDoc2" color="7" fill="1" visible="yes" active="yes"/>
<layer number="155" name="FabDoc3" color="7" fill="1" visible="yes" active="yes"/>
<layer number="199" name="Contour" color="7" fill="1" visible="yes" active="yes"/>
<layer number="200" name="200bmp" color="1" fill="10" visible="yes" active="yes"/>
<layer number="201" name="201bmp" color="2" fill="10" visible="yes" active="yes"/>
<layer number="202" name="202bmp" color="3" fill="10" visible="yes" active="yes"/>
<layer number="203" name="203bmp" color="4" fill="10" visible="yes" active="yes"/>
<layer number="204" name="204bmp" color="5" fill="10" visible="yes" active="yes"/>
<layer number="205" name="205bmp" color="6" fill="10" visible="yes" active="yes"/>
<layer number="206" name="206bmp" color="7" fill="10" visible="yes" active="yes"/>
<layer number="207" name="207bmp" color="8" fill="10" visible="yes" active="yes"/>
<layer number="208" name="208bmp" color="9" fill="10" visible="yes" active="yes"/>
<layer number="209" name="209bmp" color="7" fill="1" visible="yes" active="yes"/>
<layer number="210" name="210bmp" color="7" fill="1" visible="yes" active="yes"/>
<layer number="211" name="211bmp" color="7" fill="1" visible="yes" active="yes"/>
<layer number="212" name="212bmp" color="7" fill="1" visible="yes" active="yes"/>
<layer number="213" name="213bmp" color="7" fill="1" visible="yes" active="yes"/>
<layer number="214" name="214bmp" color="7" fill="1" visible="yes" active="yes"/>
<layer number="215" name="215bmp" color="7" fill="1" visible="yes" active="yes"/>
<layer number="216" name="216bmp" color="7" fill="1" visible="yes" active="yes"/>
<layer number="217" name="217bmp" color="18" fill="1" visible="no" active="no"/>
<layer number="218" name="218bmp" color="19" fill="1" visible="no" active="no"/>
<layer number="219" name="219bmp" color="20" fill="1" visible="no" active="no"/>
<layer number="220" name="220bmp" color="21" fill="1" visible="no" active="no"/>
<layer number="221" name="221bmp" color="22" fill="1" visible="no" active="no"/>
<layer number="222" name="222bmp" color="23" fill="1" visible="no" active="no"/>
<layer number="223" name="223bmp" color="24" fill="1" visible="no" active="no"/>
<layer number="224" name="224bmp" color="25" fill="1" visible="no" active="no"/>
<layer number="225" name="225bmp" color="7" fill="1" visible="yes" active="yes"/>
<layer number="226" name="226bmp" color="7" fill="1" visible="yes" active="yes"/>
<layer number="227" name="227bmp" color="7" fill="1" visible="yes" active="yes"/>
<layer number="228" name="228bmp" color="7" fill="1" visible="yes" active="yes"/>
<layer number="229" name="229bmp" color="7" fill="1" visible="yes" active="yes"/>
<layer number="230" name="230bmp" color="7" fill="1" visible="yes" active="yes"/>
<layer number="231" name="231bmp" color="7" fill="1" visible="yes" active="yes"/>
<layer number="232" name="Eagle3D_PG2" color="7" fill="1" visible="yes" active="yes"/>
<layer number="233" name="Eagle3D_PG3" color="7" fill="1" visible="yes" active="yes"/>
<layer number="248" name="Housing" color="7" fill="1" visible="yes" active="yes"/>
<layer number="249" name="Edge" color="7" fill="1" visible="yes" active="yes"/>
<layer number="250" name="Descript" color="3" fill="1" visible="no" active="no"/>
<layer number="251" name="SMDround" color="12" fill="11" visible="no" active="no"/>
<layer number="254" name="cooling" color="7" fill="1" visible="yes" active="yes"/>
<layer number="255" name="routoute" color="7" fill="1" visible="yes" active="yes"/>
</layers>
<schematic xreflabel="%F%N/%S.%C%R" xrefpart="/%S.%C%R">
<libraries>
<library name="fab">
<packages>
<package name="MSOP8">
<description>&lt;b&gt;8M, 8-Lead, 0.118" Wide, Miniature Small Outline Package&lt;/b&gt;&lt;p&gt;
MSOP&lt;br&gt;
8M-Package doc1097.pdf</description>
<wire x1="-1.48" y1="1.23" x2="-1.23" y2="1.48" width="0.1524" layer="21" curve="-90" cap="flat"/>
<wire x1="1.23" y1="1.48" x2="1.48" y2="1.23" width="0.1524" layer="21" curve="-90"/>
<wire x1="1.23" y1="-1.49" x2="1.48" y2="-1.24" width="0.1524" layer="21" curve="90"/>
<wire x1="-1.48" y1="-1.24" x2="-1.23" y2="-1.49" width="0.1524" layer="21" curve="90" cap="flat"/>
<wire x1="1.24" y1="-1.49" x2="-1.22" y2="-1.49" width="0.1524" layer="21"/>
<wire x1="-1.22" y1="1.48" x2="1.24" y2="1.48" width="0.1524" layer="21"/>
<wire x1="-1.48" y1="1.23" x2="-1.48" y2="-1.23" width="0.1524" layer="21"/>
<wire x1="1.48" y1="-1.24" x2="1.48" y2="1.23" width="0.1524" layer="21"/>
<smd name="1" x="-0.975" y="-2.25" dx="0.4" dy="1.1" layer="1"/>
<smd name="2" x="-0.325" y="-2.25" dx="0.4" dy="1.1" layer="1"/>
<smd name="3" x="0.325" y="-2.25" dx="0.4" dy="1.1" layer="1"/>
<smd name="4" x="0.975" y="-2.25" dx="0.4" dy="1.1" layer="1"/>
<smd name="5" x="0.975" y="2.25" dx="0.4" dy="1.1" layer="1"/>
<smd name="6" x="0.325" y="2.25" dx="0.4" dy="1.1" layer="1"/>
<smd name="7" x="-0.325" y="2.25" dx="0.4" dy="1.1" layer="1"/>
<smd name="8" x="-0.975" y="2.25" dx="0.4" dy="1.1" layer="1"/>
<text x="-2.54" y="-1.27" size="0.4064" layer="25" rot="R90">&gt;NAME</text>
<text x="2.54" y="-1.27" size="0.4064" layer="27" rot="R90">&gt;VALUE</text>
<rectangle x1="-1.175" y1="-2.45" x2="-0.775" y2="-1.55" layer="51"/>
<rectangle x1="-0.525" y1="-2.45" x2="-0.125" y2="-1.55" layer="51"/>
<rectangle x1="0.125" y1="-2.45" x2="0.525" y2="-1.55" layer="51"/>
<rectangle x1="0.775" y1="-2.45" x2="1.175" y2="-1.55" layer="51"/>
<rectangle x1="0.775" y1="1.55" x2="1.175" y2="2.45" layer="51"/>
<rectangle x1="0.125" y1="1.55" x2="0.525" y2="2.45" layer="51"/>
<rectangle x1="-0.525" y1="1.55" x2="-0.125" y2="2.45" layer="51"/>
<rectangle x1="-1.175" y1="1.55" x2="-0.775" y2="2.45" layer="51"/>
<circle x="-1.6256" y="-2.0574" radius="0.091578125" width="0.4064" layer="21"/>
</package>
<package name="2X4">
<description>&lt;h3&gt;Plated Through Hole - 2x4&lt;/h3&gt;
&lt;p&gt;Specifications:
&lt;ul&gt;&lt;li&gt;Pin count:8&lt;/li&gt;
&lt;li&gt;Pin pitch:0.1"&lt;/li&gt;
&lt;/ul&gt;&lt;/p&gt;
&lt;p&gt;Example device(s):
&lt;ul&gt;&lt;li&gt;CONN_04x2&lt;/li&gt;
&lt;/ul&gt;&lt;/p&gt;</description>
<wire x1="-5.08" y1="-1.905" x2="-4.445" y2="-2.54" width="0.2032" layer="21"/>
<wire x1="-3.175" y1="-2.54" x2="-2.54" y2="-1.905" width="0.2032" layer="21"/>
<wire x1="-2.54" y1="-1.905" x2="-1.905" y2="-2.54" width="0.2032" layer="21"/>
<wire x1="-0.635" y1="-2.54" x2="0" y2="-1.905" width="0.2032" layer="21"/>
<wire x1="0" y1="-1.905" x2="0.635" y2="-2.54" width="0.2032" layer="21"/>
<wire x1="1.905" y1="-2.54" x2="2.54" y2="-1.905" width="0.2032" layer="21"/>
<wire x1="2.54" y1="-1.905" x2="3.175" y2="-2.54" width="0.2032" layer="21"/>
<wire x1="4.445" y1="-2.54" x2="5.08" y2="-1.905" width="0.2032" layer="21"/>
<wire x1="-5.08" y1="-1.905" x2="-5.08" y2="1.905" width="0.2032" layer="21"/>
<wire x1="-5.08" y1="1.905" x2="-4.445" y2="2.54" width="0.2032" layer="21"/>
<wire x1="-4.445" y1="2.54" x2="-3.175" y2="2.54" width="0.2032" layer="21"/>
<wire x1="-3.175" y1="2.54" x2="-2.54" y2="1.905" width="0.2032" layer="21"/>
<wire x1="-2.54" y1="1.905" x2="-1.905" y2="2.54" width="0.2032" layer="21"/>
<wire x1="-1.905" y1="2.54" x2="-0.635" y2="2.54" width="0.2032" layer="21"/>
<wire x1="-0.635" y1="2.54" x2="0" y2="1.905" width="0.2032" layer="21"/>
<wire x1="0" y1="1.905" x2="0.635" y2="2.54" width="0.2032" layer="21"/>
<wire x1="0.635" y1="2.54" x2="1.905" y2="2.54" width="0.2032" layer="21"/>
<wire x1="1.905" y1="2.54" x2="2.54" y2="1.905" width="0.2032" layer="21"/>
<wire x1="2.54" y1="1.905" x2="3.175" y2="2.54" width="0.2032" layer="21"/>
<wire x1="3.175" y1="2.54" x2="4.445" y2="2.54" width="0.2032" layer="21"/>
<wire x1="4.445" y1="2.54" x2="5.08" y2="1.905" width="0.2032" layer="21"/>
<wire x1="5.08" y1="1.905" x2="5.08" y2="-1.905" width="0.2032" layer="21"/>
<wire x1="3.175" y1="-2.54" x2="4.445" y2="-2.54" width="0.2032" layer="21"/>
<wire x1="0.635" y1="-2.54" x2="1.905" y2="-2.54" width="0.2032" layer="21"/>
<wire x1="-1.905" y1="-2.54" x2="-0.635" y2="-2.54" width="0.2032" layer="21"/>
<wire x1="-4.445" y1="-2.54" x2="-3.175" y2="-2.54" width="0.2032" layer="21"/>
<pad name="1" x="-3.81" y="-1.27" drill="1.016" diameter="1.8796"/>
<pad name="2" x="-3.81" y="1.27" drill="1.016" diameter="1.8796"/>
<pad name="3" x="-1.27" y="-1.27" drill="1.016" diameter="1.8796"/>
<pad name="4" x="-1.27" y="1.27" drill="1.016" diameter="1.8796"/>
<pad name="5" x="1.27" y="-1.27" drill="1.016" diameter="1.8796"/>
<pad name="6" x="1.27" y="1.27" drill="1.016" diameter="1.8796"/>
<pad name="7" x="3.81" y="-1.27" drill="1.016" diameter="1.8796"/>
<pad name="8" x="3.81" y="1.27" drill="1.016" diameter="1.8796"/>
<rectangle x1="-4.064" y1="-1.524" x2="-3.556" y2="-1.016" layer="51"/>
<rectangle x1="-4.064" y1="1.016" x2="-3.556" y2="1.524" layer="51"/>
<rectangle x1="-1.524" y1="1.016" x2="-1.016" y2="1.524" layer="51"/>
<rectangle x1="-1.524" y1="-1.524" x2="-1.016" y2="-1.016" layer="51"/>
<rectangle x1="1.016" y1="1.016" x2="1.524" y2="1.524" layer="51"/>
<rectangle x1="1.016" y1="-1.524" x2="1.524" y2="-1.016" layer="51"/>
<rectangle x1="3.556" y1="1.016" x2="4.064" y2="1.524" layer="51"/>
<rectangle x1="3.556" y1="-1.524" x2="4.064" y2="-1.016" layer="51"/>
<wire x1="-4.445" y1="-2.794" x2="-3.175" y2="-2.794" width="0.2032" layer="21"/>
<wire x1="-3.175" y1="-2.794" x2="-4.445" y2="-2.794" width="0.2032" layer="22"/>
<wire x1="-5.08" y1="-1.905" x2="-4.445" y2="-2.54" width="0.2032" layer="21"/>
<wire x1="-5.08" y1="-1.905" x2="-5.08" y2="1.905" width="0.2032" layer="21"/>
<wire x1="-5.08" y1="1.905" x2="-4.445" y2="2.54" width="0.2032" layer="21"/>
<text x="-5.08" y="2.794" size="0.6096" layer="25" font="vector" ratio="20">&gt;NAME</text>
<text x="-5.08" y="-3.683" size="0.6096" layer="27" font="vector" ratio="20">&gt;VALUE</text>
</package>
<package name="2X4-SHROUDED">
<description>&lt;h3&gt;Plated Through Hole - 2x3 Shrouded Header&lt;/h3&gt;
&lt;p&gt;Specifications:
&lt;ul&gt;&lt;li&gt;Pin count:6&lt;/li&gt;
&lt;li&gt;Pin pitch:0.1"&lt;/li&gt;
&lt;/ul&gt;&lt;/p&gt;
&lt;p&gt;&lt;a href=”https://www.sparkfun.com/datasheets/Prototyping/Shrouded-10pin.pdf”&gt;Datasheet referenced for footprint&lt;/a&gt;&lt;/p&gt;
&lt;p&gt;Example device(s):
&lt;ul&gt;&lt;li&gt;CONN_03x2&lt;/li&gt;
&lt;/ul&gt;&lt;/p&gt;</description>
<wire x1="4.5" y1="7.56" x2="4.5" y2="-10.1" width="0.2032" layer="21"/>
<wire x1="-4.5" y1="-10.1" x2="-4.5" y2="-3.47" width="0.2032" layer="21"/>
<wire x1="-4.5" y1="-3.47" x2="-4.5" y2="0.93" width="0.2032" layer="21"/>
<wire x1="-4.5" y1="0.93" x2="-4.5" y2="7.56" width="0.2032" layer="21"/>
<wire x1="-4.5" y1="7.56" x2="4.4" y2="7.56" width="0.2032" layer="21"/>
<wire x1="4.5" y1="-10.1" x2="-4.5" y2="-10.1" width="0.2032" layer="21"/>
<wire x1="-3.4" y1="6.46" x2="3.4" y2="6.46" width="0.2032" layer="51"/>
<wire x1="3.4" y1="6.46" x2="3.4" y2="-9" width="0.2032" layer="51"/>
<wire x1="-3.4" y1="-9" x2="3.4" y2="-9" width="0.2032" layer="51"/>
<wire x1="-4.5" y1="0.93" x2="-3" y2="0.93" width="0.2032" layer="21"/>
<wire x1="-3" y1="0.93" x2="-3" y2="-3.47" width="0.2032" layer="21"/>
<wire x1="-3" y1="-3.47" x2="-4.5" y2="-3.47" width="0.2032" layer="21"/>
<wire x1="-3.4" y1="6.46" x2="-3.4" y2="0.93" width="0.2032" layer="51"/>
<wire x1="-3.4" y1="-9" x2="-3.4" y2="-3.47" width="0.2032" layer="51"/>
<pad name="1" x="-1.27" y="2.54" drill="1.016" diameter="1.8796" rot="R270"/>
<pad name="2" x="1.27" y="2.54" drill="1.016" diameter="1.8796" rot="R270"/>
<pad name="3" x="-1.27" y="0" drill="1.016" diameter="1.8796" rot="R270"/>
<pad name="4" x="1.27" y="0" drill="1.016" diameter="1.8796" rot="R270"/>
<pad name="5" x="-1.27" y="-2.54" drill="1.016" diameter="1.8796" rot="R270"/>
<pad name="6" x="1.27" y="-2.54" drill="1.016" diameter="1.8796" rot="R270"/>
<rectangle x1="1.016" y1="2.286" x2="1.524" y2="2.794" layer="51"/>
<rectangle x1="-1.524" y1="2.286" x2="-1.016" y2="2.794" layer="51"/>
<rectangle x1="1.016" y1="-0.254" x2="1.524" y2="0.254" layer="51"/>
<rectangle x1="-1.524" y1="-0.254" x2="-1.016" y2="0.254" layer="51"/>
<rectangle x1="1.016" y1="-2.794" x2="1.524" y2="-2.286" layer="51"/>
<rectangle x1="-1.524" y1="-2.794" x2="-1.016" y2="-2.286" layer="51"/>
<rectangle x1="-1.524" y1="-2.794" x2="-1.016" y2="-2.286" layer="51"/>
<rectangle x1="1.016" y1="-2.794" x2="1.524" y2="-2.286" layer="51"/>
<text x="-3.81" y="7.874" size="0.6096" layer="25" font="vector" ratio="20">&gt;NAME</text>
<text x="-3.81" y="-10.922" size="0.6096" layer="27" font="vector" ratio="20">&gt;VALUE</text>
<wire x1="-5.188" y1="3.175" x2="-5.188" y2="1.905" width="0.2032" layer="21"/>
<wire x1="-2.686" y1="3.175" x2="-2.686" y2="1.905" width="0.2032" layer="22"/>
<pad name="7" x="-1.27" y="-5.08" drill="1.016" diameter="1.8796" rot="R270"/>
<pad name="8" x="1.27" y="-5.08" drill="1.016" diameter="1.8796" rot="R270"/>
<rectangle x1="1.016" y1="-5.334" x2="1.524" y2="-4.826" layer="51"/>
<rectangle x1="-1.524" y1="-5.334" x2="-1.016" y2="-4.826" layer="51"/>
<rectangle x1="-1.524" y1="-5.334" x2="-1.016" y2="-4.826" layer="51"/>
<rectangle x1="1.016" y1="-5.334" x2="1.524" y2="-4.826" layer="51"/>
</package>
<package name="2X4-SHROUDED-SQUISH">
<description>&lt;h3&gt;Plated Through Hole - 2x3 Shrouded Header&lt;/h3&gt;
&lt;p&gt;Specifications:
&lt;ul&gt;&lt;li&gt;Pin count:6&lt;/li&gt;
&lt;li&gt;Pin pitch:0.1"&lt;/li&gt;
&lt;/ul&gt;&lt;/p&gt;
&lt;p&gt;&lt;a href=”https://www.sparkfun.com/datasheets/Prototyping/Shrouded-10pin.pdf”&gt;Datasheet referenced for footprint&lt;/a&gt;&lt;/p&gt;
&lt;p&gt;Example device(s):
&lt;ul&gt;&lt;li&gt;CONN_03x2&lt;/li&gt;
&lt;/ul&gt;&lt;/p&gt;</description>
<wire x1="4.5" y1="7.56" x2="4.5" y2="-10.1" width="0.2032" layer="21"/>
<wire x1="-4.5" y1="-10.1" x2="-4.5" y2="-3.47" width="0.2032" layer="21"/>
<wire x1="-4.5" y1="-3.47" x2="-4.5" y2="0.93" width="0.2032" layer="21"/>
<wire x1="-4.5" y1="0.93" x2="-4.5" y2="7.56" width="0.2032" layer="21"/>
<wire x1="-4.5" y1="7.56" x2="4.4" y2="7.56" width="0.2032" layer="21"/>
<wire x1="4.5" y1="-10.1" x2="-4.5" y2="-10.1" width="0.2032" layer="21"/>
<wire x1="-3.4" y1="6.46" x2="3.4" y2="6.46" width="0.2032" layer="51"/>
<wire x1="3.4" y1="6.46" x2="3.4" y2="-9" width="0.2032" layer="51"/>
<wire x1="-3.4" y1="-9" x2="3.4" y2="-9" width="0.2032" layer="51"/>
<wire x1="-4.5" y1="0.93" x2="-3" y2="0.93" width="0.2032" layer="21"/>
<wire x1="-3" y1="0.93" x2="-3" y2="-3.47" width="0.2032" layer="21"/>
<wire x1="-3" y1="-3.47" x2="-4.5" y2="-3.47" width="0.2032" layer="21"/>
<wire x1="-3.4" y1="6.46" x2="-3.4" y2="0.93" width="0.2032" layer="51"/>
<wire x1="-3.4" y1="-9" x2="-3.4" y2="-3.47" width="0.2032" layer="51"/>
<pad name="1" x="-1.27" y="2.54" drill="1.016" diameter="1.6764" rot="R270"/>
<pad name="2" x="1.27" y="2.54" drill="1.016" diameter="1.6764" rot="R270"/>
<pad name="3" x="-1.27" y="0" drill="1.016" diameter="1.6764" rot="R270"/>
<pad name="4" x="1.27" y="0" drill="1.016" diameter="1.6764" rot="R270"/>
<pad name="5" x="-1.27" y="-2.54" drill="1.016" diameter="1.6764" rot="R270"/>
<pad name="6" x="1.27" y="-2.54" drill="1.016" diameter="1.6764" rot="R270"/>
<rectangle x1="1.016" y1="2.286" x2="1.524" y2="2.794" layer="51"/>
<rectangle x1="-1.524" y1="2.286" x2="-1.016" y2="2.794" layer="51"/>
<rectangle x1="1.016" y1="-0.254" x2="1.524" y2="0.254" layer="51"/>
<rectangle x1="-1.524" y1="-0.254" x2="-1.016" y2="0.254" layer="51"/>
<rectangle x1="1.016" y1="-2.794" x2="1.524" y2="-2.286" layer="51"/>
<rectangle x1="-1.524" y1="-2.794" x2="-1.016" y2="-2.286" layer="51"/>
<rectangle x1="-1.524" y1="-2.794" x2="-1.016" y2="-2.286" layer="51"/>
<rectangle x1="1.016" y1="-2.794" x2="1.524" y2="-2.286" layer="51"/>
<text x="-3.81" y="7.874" size="0.6096" layer="25" font="vector" ratio="20">&gt;NAME</text>
<text x="-3.81" y="-10.922" size="0.6096" layer="27" font="vector" ratio="20">&gt;VALUE</text>
<wire x1="-5.188" y1="3.175" x2="-5.188" y2="1.905" width="0.2032" layer="21"/>
<wire x1="-2.686" y1="3.175" x2="-2.686" y2="1.905" width="0.2032" layer="22"/>
<pad name="7" x="-1.27" y="-5.08" drill="1.016" diameter="1.6764" rot="R270"/>
<pad name="8" x="1.27" y="-5.08" drill="1.016" diameter="1.6764" rot="R270"/>
<rectangle x1="1.016" y1="-5.334" x2="1.524" y2="-4.826" layer="51"/>
<rectangle x1="-1.524" y1="-5.334" x2="-1.016" y2="-4.826" layer="51"/>
<rectangle x1="-1.524" y1="-5.334" x2="-1.016" y2="-4.826" layer="51"/>
<rectangle x1="1.016" y1="-5.334" x2="1.524" y2="-4.826" layer="51"/>
</package>
<package name="MSOP8-8MILPADS">
<description>&lt;b&gt;8M, 8-Lead, 0.118" Wide, Miniature Small Outline Package&lt;/b&gt;&lt;p&gt;
MSOP&lt;br&gt;
8M-Package doc1097.pdf</description>
<wire x1="-1.48" y1="1.23" x2="-1.23" y2="1.48" width="0.1524" layer="21" curve="-90" cap="flat"/>
<wire x1="1.23" y1="1.48" x2="1.48" y2="1.23" width="0.1524" layer="21" curve="-90"/>
<wire x1="1.23" y1="-1.49" x2="1.48" y2="-1.24" width="0.1524" layer="21" curve="90"/>
<wire x1="-1.48" y1="-1.24" x2="-1.23" y2="-1.49" width="0.1524" layer="21" curve="90" cap="flat"/>
<wire x1="1.24" y1="-1.49" x2="-1.22" y2="-1.49" width="0.1524" layer="21"/>
<wire x1="-1.22" y1="1.48" x2="1.24" y2="1.48" width="0.1524" layer="21"/>
<wire x1="-1.48" y1="1.23" x2="-1.48" y2="-1.23" width="0.1524" layer="21"/>
<wire x1="1.48" y1="-1.24" x2="1.48" y2="1.23" width="0.1524" layer="21"/>
<smd name="1" x="-0.975" y="-2.25" dx="0.2286" dy="1.143" layer="1"/>
<smd name="2" x="-0.325" y="-2.25" dx="0.2286" dy="1.143" layer="1"/>
<smd name="3" x="0.325" y="-2.25" dx="0.2286" dy="1.143" layer="1"/>
<smd name="4" x="0.975" y="-2.25" dx="0.2286" dy="1.143" layer="1"/>
<smd name="5" x="0.975" y="2.25" dx="0.2286" dy="1.143" layer="1"/>
<smd name="6" x="0.325" y="2.25" dx="0.2286" dy="1.143" layer="1"/>
<smd name="7" x="-0.325" y="2.25" dx="0.2286" dy="1.143" layer="1"/>
<smd name="8" x="-0.975" y="2.25" dx="0.2286" dy="1.143" layer="1"/>
<text x="-2.54" y="-1.27" size="0.4064" layer="25" rot="R90">&gt;NAME</text>
<text x="2.54" y="-1.27" size="0.4064" layer="27" rot="R90">&gt;VALUE</text>
<rectangle x1="-1.175" y1="-2.45" x2="-0.775" y2="-1.55" layer="51"/>
<rectangle x1="-0.525" y1="-2.45" x2="-0.125" y2="-1.55" layer="51"/>
<rectangle x1="0.125" y1="-2.45" x2="0.525" y2="-1.55" layer="51"/>
<rectangle x1="0.775" y1="-2.45" x2="1.175" y2="-1.55" layer="51"/>
<rectangle x1="0.775" y1="1.55" x2="1.175" y2="2.45" layer="51"/>
<rectangle x1="0.125" y1="1.55" x2="0.525" y2="2.45" layer="51"/>
<rectangle x1="-0.525" y1="1.55" x2="-0.125" y2="2.45" layer="51"/>
<rectangle x1="-1.175" y1="1.55" x2="-0.775" y2="2.45" layer="51"/>
<circle x="-1.6256" y="-2.0574" radius="0.091578125" width="0.4064" layer="21"/>
</package>
<package name="DX4R005HJ5_100">
<wire x1="3.25" y1="-2.6" x2="-3.25" y2="-2.6" width="0.127" layer="21"/>
<wire x1="-3.25" y1="2.6" x2="-3.25" y2="0" width="0.127" layer="51"/>
<wire x1="3.25" y1="2.6" x2="3.25" y2="0" width="0.127" layer="51"/>
<wire x1="-1.75" y1="2.6" x2="1.75" y2="2.6" width="0.127" layer="51"/>
<wire x1="-3.25" y1="-2.2" x2="-3.25" y2="-2.6" width="0.127" layer="51"/>
<wire x1="3.25" y1="-2.6" x2="3.25" y2="-2.2" width="0.127" layer="51"/>
<smd name="GND@3" x="-2.175" y="-1.1" dx="2.15" dy="1.9" layer="1"/>
<smd name="GND@4" x="2.175" y="-1.1" dx="2.15" dy="1.9" layer="1"/>
<smd name="GND@1" x="-2.5" y="1.95" dx="1.2" dy="1.3" layer="1"/>
<smd name="GND@2" x="2.5" y="1.95" dx="1.2" dy="1.3" layer="1"/>
<smd name="D+" x="0" y="1.6" dx="0.35" dy="1.35" layer="1"/>
<smd name="D-" x="-0.65" y="1.6" dx="0.35" dy="1.35" layer="1"/>
<smd name="VBUS" x="-1.3" y="1.6" dx="0.35" dy="1.35" layer="1"/>
<smd name="ID" x="0.65" y="1.6" dx="0.35" dy="1.35" layer="1"/>
<smd name="GND" x="1.3" y="1.6" dx="0.35" dy="1.35" layer="1"/>
<text x="4.1275" y="-1.5875" size="0.6096" layer="27" font="vector" rot="R90">&gt;Value</text>
<text x="-3.4925" y="-1.27" size="0.6096" layer="25" font="vector" rot="R90">&gt;Name</text>
</package>
<package name="DX4R005HJ5">
<wire x1="3.25" y1="-2.6" x2="-3.25" y2="-2.6" width="0.127" layer="21"/>
<wire x1="-3.25" y1="2.6" x2="-3.25" y2="0" width="0.127" layer="51"/>
<wire x1="3.25" y1="2.6" x2="3.25" y2="0" width="0.127" layer="51"/>
<wire x1="-1.75" y1="2.6" x2="1.75" y2="2.6" width="0.127" layer="51"/>
<wire x1="-3.25" y1="-2.2" x2="-3.25" y2="-2.6" width="0.127" layer="51"/>
<wire x1="3.25" y1="-2.6" x2="3.25" y2="-2.2" width="0.127" layer="51"/>
<smd name="GND@3" x="-2.175" y="-1.1" dx="2.15" dy="1.9" layer="1"/>
<smd name="GND@4" x="2.175" y="-1.1" dx="2.15" dy="1.9" layer="1"/>
<smd name="GND@1" x="-2.5" y="1.95" dx="1.2" dy="1.3" layer="1"/>
<smd name="GND@2" x="2.5" y="1.95" dx="1.2" dy="1.3" layer="1"/>
<smd name="D+" x="0" y="1.6" dx="0.4" dy="1.35" layer="1"/>
<smd name="D-" x="-0.65" y="1.6" dx="0.4" dy="1.35" layer="1"/>
<smd name="VBUS" x="-1.3" y="1.6" dx="0.4" dy="1.35" layer="1"/>
<smd name="ID" x="0.65" y="1.6" dx="0.4" dy="1.35" layer="1"/>
<smd name="GND" x="1.3" y="1.6" dx="0.4" dy="1.35" layer="1"/>
<text x="-3.4925" y="-1.27" size="0.6096" layer="25" font="vector" rot="R90">&gt;Name</text>
<text x="4.1275" y="-1.5875" size="0.6096" layer="25" font="vector" rot="R90">&gt;Value</text>
</package>
<package name="DX4R005HJ5_64">
<wire x1="3.25" y1="-2.6" x2="-3.25" y2="-2.6" width="0.127" layer="21"/>
<wire x1="-3.25" y1="2.6" x2="-3.25" y2="0" width="0.127" layer="51"/>
<wire x1="3.25" y1="2.6" x2="3.25" y2="0" width="0.127" layer="51"/>
<wire x1="-1.75" y1="2.6" x2="1.75" y2="2.6" width="0.127" layer="51"/>
<wire x1="-3.25" y1="-2.2" x2="-3.25" y2="-2.6" width="0.127" layer="51"/>
<wire x1="3.25" y1="-2.6" x2="3.25" y2="-2.2" width="0.127" layer="51"/>
<smd name="GND@3" x="-2.175" y="-1.1" dx="2.15" dy="1.9" layer="1"/>
<smd name="GND@4" x="2.175" y="-1.1" dx="2.15" dy="1.9" layer="1"/>
<smd name="GND@1" x="-2.5" y="1.95" dx="1.2" dy="1.3" layer="1"/>
<smd name="GND@2" x="2.5" y="1.95" dx="1.2" dy="1.3" layer="1"/>
<smd name="D+" x="0" y="1.6" dx="0.254" dy="1.35" layer="1"/>
<smd name="D-" x="-0.65" y="1.6" dx="0.254" dy="1.35" layer="1"/>
<smd name="VBUS" x="-1.3" y="1.6" dx="0.254" dy="1.35" layer="1"/>
<smd name="ID" x="0.65" y="1.6" dx="0.254" dy="1.35" layer="1"/>
<smd name="GND" x="1.3" y="1.6" dx="0.254" dy="1.35" layer="1"/>
<text x="-3.4925" y="-1.27" size="0.6096" layer="25" font="vector" rot="R90">&gt;Name</text>
<text x="4.1275" y="-1.5875" size="0.6096" layer="27" font="vector" rot="R90">&gt;Value</text>
</package>
<package name="QFN-16-3X3-1-100">
<description>&lt;b&gt;16-Lead Plastic QFN (3mm × 3mm)&lt;/b&gt;&lt;p&gt;
Auto generated by &lt;i&gt;make-symbol-device-package-bsdl.ulp Rev. 44&lt;/i&gt;&lt;br&gt;
&lt;br&gt;
Source: http://cds.linear.com/docs/en/datasheet/3645f.pdf&lt;br&gt;</description>
<smd name="1" x="-1.4" y="0.75" dx="0.762" dy="0.1524" layer="1" stop="no"/>
<smd name="2" x="-1.4" y="0.25" dx="0.762" dy="0.1524" layer="1" stop="no"/>
<smd name="3" x="-1.4" y="-0.25" dx="0.762" dy="0.1524" layer="1" stop="no"/>
<smd name="4" x="-1.4" y="-0.75" dx="0.762" dy="0.1524" layer="1" stop="no"/>
<smd name="5" x="-0.75" y="-1.4" dx="0.1524" dy="0.762" layer="1" stop="no"/>
<smd name="6" x="-0.25" y="-1.4" dx="0.1524" dy="0.762" layer="1" stop="no"/>
<smd name="7" x="0.25" y="-1.4" dx="0.1524" dy="0.762" layer="1" stop="no"/>
<smd name="8" x="0.75" y="-1.4" dx="0.1524" dy="0.762" layer="1" stop="no"/>
<smd name="9" x="1.4" y="-0.75" dx="0.762" dy="0.1524" layer="1" stop="no"/>
<smd name="10" x="1.4" y="-0.25" dx="0.762" dy="0.1524" layer="1" stop="no"/>
<smd name="11" x="1.4" y="0.25" dx="0.762" dy="0.1524" layer="1" stop="no"/>
<smd name="12" x="1.4" y="0.75" dx="0.762" dy="0.1524" layer="1" stop="no"/>
<smd name="13" x="0.75" y="1.4" dx="0.1524" dy="0.762" layer="1" stop="no"/>
<smd name="14" x="0.25" y="1.4" dx="0.1524" dy="0.762" layer="1" stop="no"/>
<smd name="15" x="-0.25" y="1.4" dx="0.1524" dy="0.762" layer="1" stop="no"/>
<smd name="16" x="-0.75" y="1.4" dx="0.1524" dy="0.762" layer="1" stop="no"/>
<smd name="EXP" x="0" y="0" dx="1.45" dy="1.45" layer="1" stop="no"/>
<wire x1="-1.3484" y1="1.05" x2="-1.05" y2="1.3484" width="0.2032" layer="21"/>
<wire x1="-1.3984" y1="-1.3984" x2="1.3984" y2="-1.3984" width="0.2032" layer="21"/>
<wire x1="1.3984" y1="-1.3984" x2="1.3984" y2="1.3984" width="0.2032" layer="21"/>
<wire x1="1.3984" y1="1.3984" x2="-1.3984" y2="1.3984" width="0.2032" layer="21"/>
<wire x1="-1.3984" y1="1.3984" x2="-1.3984" y2="-1.3984" width="0.2032" layer="21"/>
<text x="-1.5" y="2.135" size="1.27" layer="25">&gt;NAME</text>
<text x="-1.5" y="-3.405" size="1.27" layer="27">&gt;VALUE</text>
<rectangle x1="-1.85" y1="0.55" x2="-1" y2="0.95" layer="29"/>
<rectangle x1="-1.85" y1="0.05" x2="-1" y2="0.45" layer="29"/>
<rectangle x1="-1.85" y1="-0.45" x2="-1" y2="-0.05" layer="29"/>
<rectangle x1="-1.85" y1="-0.95" x2="-1" y2="-0.55" layer="29"/>
<rectangle x1="-1.175" y1="-1.625" x2="-0.325" y2="-1.225" layer="29" rot="R90"/>
<rectangle x1="-0.675" y1="-1.625" x2="0.175" y2="-1.225" layer="29" rot="R90"/>
<rectangle x1="-0.175" y1="-1.625" x2="0.675" y2="-1.225" layer="29" rot="R90"/>
<rectangle x1="0.325" y1="-1.625" x2="1.175" y2="-1.225" layer="29" rot="R90"/>
<rectangle x1="1" y1="-0.95" x2="1.85" y2="-0.55" layer="29" rot="R180"/>
<rectangle x1="1" y1="-0.45" x2="1.85" y2="-0.05" layer="29" rot="R180"/>
<rectangle x1="1" y1="0.05" x2="1.85" y2="0.45" layer="29" rot="R180"/>
<rectangle x1="1" y1="0.55" x2="1.85" y2="0.95" layer="29" rot="R180"/>
<rectangle x1="0.325" y1="1.225" x2="1.175" y2="1.625" layer="29" rot="R270"/>
<rectangle x1="-0.175" y1="1.225" x2="0.675" y2="1.625" layer="29" rot="R270"/>
<rectangle x1="-0.675" y1="1.225" x2="0.175" y2="1.625" layer="29" rot="R270"/>
<rectangle x1="-1.175" y1="1.225" x2="-0.325" y2="1.625" layer="29" rot="R270"/>
<rectangle x1="-0.8" y1="-0.8" x2="0.8" y2="0.8" layer="29"/>
</package>
<package name="SOT223">
<description>&lt;b&gt;SOT-223&lt;/b&gt;</description>
<wire x1="3.2766" y1="1.651" x2="3.2766" y2="-1.651" width="0.2032" layer="21"/>
<wire x1="3.2766" y1="-1.651" x2="-3.2766" y2="-1.651" width="0.2032" layer="21"/>
<wire x1="-3.2766" y1="-1.651" x2="-3.2766" y2="1.651" width="0.2032" layer="21"/>
<wire x1="-3.2766" y1="1.651" x2="3.2766" y2="1.651" width="0.2032" layer="21"/>
<smd name="1" x="-2.3114" y="-3.0988" dx="1.2192" dy="2.2352" layer="1"/>
<smd name="2" x="0" y="-3.0988" dx="1.2192" dy="2.2352" layer="1"/>
<smd name="3" x="2.3114" y="-3.0988" dx="1.2192" dy="2.2352" layer="1"/>
<smd name="4" x="0" y="3.099" dx="3.6" dy="2.2" layer="1" thermals="no"/>
<text x="-0.8255" y="4.5085" size="0.4064" layer="25">&gt;NAME</text>
<text x="-1.0795" y="-0.1905" size="0.4064" layer="27">&gt;VALUE</text>
<rectangle x1="-1.6002" y1="1.8034" x2="1.6002" y2="3.6576" layer="51"/>
<rectangle x1="-0.4318" y1="-3.6576" x2="0.4318" y2="-1.8034" layer="51"/>
<rectangle x1="-2.7432" y1="-3.6576" x2="-1.8796" y2="-1.8034" layer="51"/>
<rectangle x1="1.8796" y1="-3.6576" x2="2.7432" y2="-1.8034" layer="51"/>
<rectangle x1="-1.6002" y1="1.8034" x2="1.6002" y2="3.6576" layer="51"/>
<rectangle x1="-0.4318" y1="-3.6576" x2="0.4318" y2="-1.8034" layer="51"/>
<rectangle x1="-2.7432" y1="-3.6576" x2="-1.8796" y2="-1.8034" layer="51"/>
<rectangle x1="1.8796" y1="-3.6576" x2="2.7432" y2="-1.8034" layer="51"/>
</package>
</packages>
<symbols>
<symbol name="ISL3177E">
<pin name="VCC" x="-12.7" y="5.08" length="middle"/>
<pin name="RO" x="-12.7" y="2.54" length="middle"/>
<pin name="DI" x="-12.7" y="0" length="middle"/>
<pin name="GND" x="-12.7" y="-2.54" length="middle"/>
<pin name="A" x="12.7" y="5.08" length="middle" rot="R180"/>
<pin name="B" x="12.7" y="2.54" length="middle" rot="R180"/>
<pin name="Z" x="12.7" y="0" length="middle" rot="R180"/>
<pin name="Y" x="12.7" y="-2.54" length="middle" rot="R180"/>
<wire x1="-7.62" y1="7.62" x2="-7.62" y2="-5.08" width="0.254" layer="94"/>
<wire x1="-7.62" y1="-5.08" x2="7.62" y2="-5.08" width="0.254" layer="94"/>
<wire x1="7.62" y1="-5.08" x2="7.62" y2="7.62" width="0.254" layer="94"/>
<wire x1="7.62" y1="7.62" x2="-7.62" y2="7.62" width="0.254" layer="94"/>
<text x="-5.08" y="7.62" size="1.778" layer="95">&gt;NAME</text>
<text x="-5.08" y="-7.62" size="1.778" layer="96">&gt;VALUE</text>
</symbol>
<symbol name="CONN_04X2">
<description>&lt;h3&gt;8 Pin Connection&lt;/h3&gt;
4x2 pin layout</description>
<wire x1="-1.27" y1="0" x2="-2.54" y2="0" width="0.6096" layer="94"/>
<wire x1="-1.27" y1="2.54" x2="-2.54" y2="2.54" width="0.6096" layer="94"/>
<wire x1="-1.27" y1="5.08" x2="-2.54" y2="5.08" width="0.6096" layer="94"/>
<wire x1="-3.81" y1="7.62" x2="-3.81" y2="-5.08" width="0.4064" layer="94"/>
<wire x1="-1.27" y1="-2.54" x2="-2.54" y2="-2.54" width="0.6096" layer="94"/>
<wire x1="3.81" y1="-5.08" x2="-3.81" y2="-5.08" width="0.4064" layer="94"/>
<wire x1="3.81" y1="-5.08" x2="3.81" y2="7.62" width="0.4064" layer="94"/>
<wire x1="-3.81" y1="7.62" x2="3.81" y2="7.62" width="0.4064" layer="94"/>
<wire x1="1.27" y1="-2.54" x2="2.54" y2="-2.54" width="0.6096" layer="94"/>
<wire x1="1.27" y1="0" x2="2.54" y2="0" width="0.6096" layer="94"/>
<wire x1="1.27" y1="2.54" x2="2.54" y2="2.54" width="0.6096" layer="94"/>
<wire x1="1.27" y1="5.08" x2="2.54" y2="5.08" width="0.6096" layer="94"/>
<text x="-3.81" y="-7.366" size="1.778" layer="96" font="vector">&gt;VALUE</text>
<text x="-4.064" y="8.128" size="1.778" layer="95" font="vector">&gt;NAME</text>
<pin name="1" x="-7.62" y="5.08" visible="pad" length="middle" direction="pas" swaplevel="1"/>
<pin name="2" x="7.62" y="5.08" visible="pad" length="middle" direction="pas" swaplevel="1" rot="R180"/>
<pin name="3" x="-7.62" y="2.54" visible="pad" length="middle" direction="pas" swaplevel="1"/>
<pin name="4" x="7.62" y="2.54" visible="pad" length="middle" direction="pas" swaplevel="1" rot="R180"/>
<pin name="5" x="-7.62" y="0" visible="pad" length="middle" direction="pas" swaplevel="1"/>
<pin name="6" x="7.62" y="0" visible="pad" length="middle" direction="pas" swaplevel="1" rot="R180"/>
<pin name="7" x="-7.62" y="-2.54" visible="pad" length="middle" direction="pas" swaplevel="1"/>
<pin name="8" x="7.62" y="-2.54" visible="pad" length="middle" direction="pas" swaplevel="1" rot="R180"/>
</symbol>
<symbol name="USB-1">
<wire x1="6.35" y1="-2.54" x2="6.35" y2="2.54" width="0.254" layer="94"/>
<wire x1="6.35" y1="2.54" x2="-3.81" y2="2.54" width="0.254" layer="94"/>
<wire x1="-3.81" y1="2.54" x2="-3.81" y2="-2.54" width="0.254" layer="94"/>
<text x="-2.54" y="-1.27" size="2.54" layer="94">USB</text>
<text x="-4.445" y="-1.905" size="1.27" layer="95" font="vector" rot="R90">&gt;Name</text>
<text x="8.255" y="-1.905" size="1.27" layer="96" font="vector" rot="R90">&gt;Value</text>
<pin name="D+" x="5.08" y="5.08" visible="pad" length="short" rot="R270"/>
<pin name="D-" x="2.54" y="5.08" visible="pad" length="short" rot="R270"/>
<pin name="VBUS" x="0" y="5.08" visible="pad" length="short" rot="R270"/>
<pin name="GND" x="-2.54" y="5.08" visible="pad" length="short" rot="R270"/>
</symbol>
<symbol name="XR21V410-USB-UART">
<pin name="GND1" x="-17.78" y="7.62" length="middle"/>
<pin name="LOWPOWER" x="-17.78" y="5.08" length="middle"/>
<pin name="GPIO5" x="-17.78" y="2.54" length="middle"/>
<pin name="GPIO4" x="-17.78" y="0" length="middle"/>
<pin name="GPIO3" x="-17.78" y="-2.54" length="middle"/>
<pin name="GPIO2" x="-17.78" y="-5.08" length="middle"/>
<pin name="GPIO1" x="-17.78" y="-7.62" length="middle"/>
<pin name="GPIO0" x="-17.78" y="-10.16" length="middle"/>
<pin name="TX" x="17.78" y="-10.16" length="middle" rot="R180"/>
<pin name="RX" x="17.78" y="-7.62" length="middle" rot="R180"/>
<pin name="SDA" x="17.78" y="-5.08" length="middle" rot="R180"/>
<pin name="SCL" x="17.78" y="-2.54" length="middle" rot="R180"/>
<pin name="GND2" x="17.78" y="0" length="middle" rot="R180"/>
<pin name="USBD-" x="17.78" y="2.54" length="middle" rot="R180"/>
<pin name="USBD+" x="17.78" y="5.08" length="middle" rot="R180"/>
<pin name="VCC" x="17.78" y="7.62" length="middle" rot="R180"/>
<wire x1="-12.7" y1="10.16" x2="-12.7" y2="-12.7" width="0.254" layer="94"/>
<wire x1="-12.7" y1="-12.7" x2="12.7" y2="-12.7" width="0.254" layer="94"/>
<wire x1="12.7" y1="-12.7" x2="12.7" y2="10.16" width="0.254" layer="94"/>
<wire x1="12.7" y1="10.16" x2="-12.7" y2="10.16" width="0.254" layer="94"/>
<text x="-12.7" y="10.16" size="1.27" layer="95">&gt;NAME</text>
<text x="-12.7" y="-15.24" size="1.27" layer="96">&gt;VALUE</text>
<pin name="GND_PAD" x="0" y="-17.78" length="middle" rot="R90"/>
</symbol>
<symbol name="REGULATOR_SOT223">
<wire x1="-6.35" y1="5.08" x2="-6.35" y2="2.54" width="0.4064" layer="94"/>
<wire x1="-6.35" y1="2.54" x2="-6.35" y2="-1.27" width="0.4064" layer="94"/>
<wire x1="-6.35" y1="-1.27" x2="0" y2="-1.27" width="0.4064" layer="94"/>
<wire x1="0" y1="-1.27" x2="6.35" y2="-1.27" width="0.4064" layer="94"/>
<wire x1="6.35" y1="-1.27" x2="6.35" y2="2.54" width="0.4064" layer="94"/>
<wire x1="6.35" y1="2.54" x2="6.35" y2="5.08" width="0.4064" layer="94"/>
<wire x1="6.35" y1="5.08" x2="-6.35" y2="5.08" width="0.4064" layer="94"/>
<wire x1="-7.62" y1="2.54" x2="-6.35" y2="2.54" width="0.254" layer="94"/>
<wire x1="0" y1="-1.27" x2="0" y2="-2.54" width="0.254" layer="94"/>
<wire x1="6.35" y1="2.54" x2="7.62" y2="2.54" width="0.254" layer="94"/>
<text x="-6.35" y="-3.81" size="1.27" layer="95">&gt;NAME</text>
<text x="1.27" y="-3.81" size="1.27" layer="96">&gt;VALUE</text>
<pin name="IN" x="-7.62" y="2.54" length="point"/>
<pin name="GND" x="0" y="-2.54" length="point" rot="R90"/>
<pin name="OUT1" x="7.62" y="2.54" length="point" rot="R180"/>
<pin name="OUT2" x="7.62" y="0" length="middle" rot="R180"/>
</symbol>
</symbols>
<devicesets>
<deviceset name="ISL3177E" prefix="U">
<gates>
<gate name="G$1" symbol="ISL3177E" x="0" y="0"/>
</gates>
<devices>
<device name="" package="MSOP8">
<connects>
<connect gate="G$1" pin="A" pad="8"/>
<connect gate="G$1" pin="B" pad="7"/>
<connect gate="G$1" pin="DI" pad="3"/>
<connect gate="G$1" pin="GND" pad="4"/>
<connect gate="G$1" pin="RO" pad="2"/>
<connect gate="G$1" pin="VCC" pad="1"/>
<connect gate="G$1" pin="Y" pad="5"/>
<connect gate="G$1" pin="Z" pad="6"/>
</connects>
<technologies>
<technology name=""/>
</technologies>
</device>
<device name="MILL" package="MSOP8-8MILPADS">
<connects>
<connect gate="G$1" pin="A" pad="8"/>
<connect gate="G$1" pin="B" pad="7"/>
<connect gate="G$1" pin="DI" pad="3"/>
<connect gate="G$1" pin="GND" pad="4"/>
<connect gate="G$1" pin="RO" pad="2"/>
<connect gate="G$1" pin="VCC" pad="1"/>
<connect gate="G$1" pin="Y" pad="5"/>
<connect gate="G$1" pin="Z" pad="6"/>
</connects>
<technologies>
<technology name=""/>
</technologies>
</device>
</devices>
</deviceset>
<deviceset name="CONN_04X2" prefix="J" uservalue="yes">
<description>&lt;h3&gt;Multi connection point. Often used as Generic Header-pin footprint for 0.1 inch spaced/style header connections&lt;/h3&gt;

&lt;p&gt;&lt;/p&gt;
&lt;b&gt;On any of the 0.1 inch spaced packages, you can populate with these:&lt;/b&gt;
&lt;ul&gt;
&lt;li&gt;&lt;a href="https://www.sparkfun.com/products/116"&gt; Break Away Headers - Straight&lt;/a&gt; (PRT-00116)&lt;/li&gt;
&lt;li&gt;&lt;a href="https://www.sparkfun.com/products/553"&gt; Break Away Male Headers - Right Angle&lt;/a&gt; (PRT-00553)&lt;/li&gt;
&lt;li&gt;&lt;a href="https://www.sparkfun.com/products/115"&gt; Female Headers&lt;/a&gt; (PRT-00115)&lt;/li&gt;
&lt;li&gt;&lt;a href="https://www.sparkfun.com/products/117"&gt; Break Away Headers - Machine Pin&lt;/a&gt; (PRT-00117)&lt;/li&gt;
&lt;li&gt;&lt;a href="https://www.sparkfun.com/products/743"&gt; Break Away Female Headers - Swiss Machine Pin&lt;/a&gt; (PRT-00743)&lt;/li&gt;
&lt;/ul&gt;</description>
<gates>
<gate name="G$1" symbol="CONN_04X2" x="0" y="0"/>
</gates>
<devices>
<device name="" package="2X4">
<connects>
<connect gate="G$1" pin="1" pad="1"/>
<connect gate="G$1" pin="2" pad="2"/>
<connect gate="G$1" pin="3" pad="3"/>
<connect gate="G$1" pin="4" pad="4"/>
<connect gate="G$1" pin="5" pad="5"/>
<connect gate="G$1" pin="6" pad="6"/>
<connect gate="G$1" pin="7" pad="7"/>
<connect gate="G$1" pin="8" pad="8"/>
</connects>
<technologies>
<technology name=""/>
</technologies>
</device>
<device name="SHROUDED" package="2X4-SHROUDED">
<connects>
<connect gate="G$1" pin="1" pad="1"/>
<connect gate="G$1" pin="2" pad="2"/>
<connect gate="G$1" pin="3" pad="3"/>
<connect gate="G$1" pin="4" pad="4"/>
<connect gate="G$1" pin="5" pad="5"/>
<connect gate="G$1" pin="6" pad="6"/>
<connect gate="G$1" pin="7" pad="7"/>
<connect gate="G$1" pin="8" pad="8"/>
</connects>
<technologies>
<technology name=""/>
</technologies>
</device>
<device name="SHROUDED-SQUISH" package="2X4-SHROUDED-SQUISH">
<connects>
<connect gate="G$1" pin="1" pad="1"/>
<connect gate="G$1" pin="2" pad="2"/>
<connect gate="G$1" pin="3" pad="3"/>
<connect gate="G$1" pin="4" pad="4"/>
<connect gate="G$1" pin="5" pad="5"/>
<connect gate="G$1" pin="6" pad="6"/>
<connect gate="G$1" pin="7" pad="7"/>
<connect gate="G$1" pin="8" pad="8"/>
</connects>
<technologies>
<technology name=""/>
</technologies>
</device>
</devices>
</deviceset>
<deviceset name="MICRO-USB" prefix="X">
<description>SMD micro USB connector as found in the fablab inventory. 
Three footprint variants included: 
&lt;ol&gt;
&lt;li&gt; original, as described by manufacturer's datasheet
&lt;li&gt; for milling with the 1/100" bit
&lt;li&gt; for milling with the 1/64" bit
&lt;/ol&gt;
&lt;p&gt;Made by Zaerc.</description>
<gates>
<gate name="G$1" symbol="USB-1" x="0" y="0"/>
</gates>
<devices>
<device name="_1/100" package="DX4R005HJ5_100">
<connects>
<connect gate="G$1" pin="D+" pad="D+"/>
<connect gate="G$1" pin="D-" pad="D-"/>
<connect gate="G$1" pin="GND" pad="GND"/>
<connect gate="G$1" pin="VBUS" pad="VBUS"/>
</connects>
<technologies>
<technology name=""/>
</technologies>
</device>
<device name="_ORIG" package="DX4R005HJ5">
<connects>
<connect gate="G$1" pin="D+" pad="D+"/>
<connect gate="G$1" pin="D-" pad="D-"/>
<connect gate="G$1" pin="GND" pad="GND"/>
<connect gate="G$1" pin="VBUS" pad="VBUS"/>
</connects>
<technologies>
<technology name=""/>
</technologies>
</device>
<device name="_1/64" package="DX4R005HJ5_64">
<connects>
<connect gate="G$1" pin="D+" pad="D+"/>
<connect gate="G$1" pin="D-" pad="D-"/>
<connect gate="G$1" pin="GND" pad="GND"/>
<connect gate="G$1" pin="VBUS" pad="VBUS"/>
</connects>
<technologies>
<technology name=""/>
</technologies>
</device>
</devices>
</deviceset>
<deviceset name="XR21V410-USB-UART">
<gates>
<gate name="G$1" symbol="XR21V410-USB-UART" x="0" y="0"/>
</gates>
<devices>
<device name="" package="QFN-16-3X3-1-100">
<connects>
<connect gate="G$1" pin="GND1" pad="1"/>
<connect gate="G$1" pin="GND2" pad="13"/>
<connect gate="G$1" pin="GND_PAD" pad="EXP"/>
<connect gate="G$1" pin="GPIO0" pad="8"/>
<connect gate="G$1" pin="GPIO1" pad="7"/>
<connect gate="G$1" pin="GPIO2" pad="6"/>
<connect gate="G$1" pin="GPIO3" pad="5"/>
<connect gate="G$1" pin="GPIO4" pad="4"/>
<connect gate="G$1" pin="GPIO5" pad="3"/>
<connect gate="G$1" pin="LOWPOWER" pad="2"/>
<connect gate="G$1" pin="RX" pad="10"/>
<connect gate="G$1" pin="SCL" pad="12"/>
<connect gate="G$1" pin="SDA" pad="11"/>
<connect gate="G$1" pin="TX" pad="9"/>
<connect gate="G$1" pin="USBD+" pad="15"/>
<connect gate="G$1" pin="USBD-" pad="14"/>
<connect gate="G$1" pin="VCC" pad="16"/>
</connects>
<technologies>
<technology name=""/>
</technologies>
</device>
</devices>
</deviceset>
<deviceset name="REGULATOR_SOT223" prefix="U">
<gates>
<gate name="G$1" symbol="REGULATOR_SOT223" x="0" y="0"/>
</gates>
<devices>
<device name="" package="SOT223">
<connects>
<connect gate="G$1" pin="GND" pad="1"/>
<connect gate="G$1" pin="IN" pad="3"/>
<connect gate="G$1" pin="OUT1" pad="2"/>
<connect gate="G$1" pin="OUT2" pad="4"/>
</connects>
<technologies>
<technology name=""/>
</technologies>
</device>
</devices>
</deviceset>
</devicesets>
</library>
<library name="supply1" urn="urn:adsk.eagle:library:371">
<description>&lt;b&gt;Supply Symbols&lt;/b&gt;&lt;p&gt;
 GND, VCC, 0V, +5V, -5V, etc.&lt;p&gt;
 Please keep in mind, that these devices are necessary for the
 automatic wiring of the supply signals.&lt;p&gt;
 The pin name defined in the symbol is identical to the net which is to be wired automatically.&lt;p&gt;
 In this library the device names are the same as the pin names of the symbols, therefore the correct signal names appear next to the supply symbols in the schematic.&lt;p&gt;
 &lt;author&gt;Created by librarian@cadsoft.de&lt;/author&gt;</description>
<packages>
</packages>
<symbols>
<symbol name="+3V3" urn="urn:adsk.eagle:symbol:26950/1" library_version="1">
<wire x1="1.27" y1="-1.905" x2="0" y2="0" width="0.254" layer="94"/>
<wire x1="0" y1="0" x2="-1.27" y2="-1.905" width="0.254" layer="94"/>
<text x="-2.54" y="-5.08" size="1.778" layer="96" rot="R90">&gt;VALUE</text>
<pin name="+3V3" x="0" y="-2.54" visible="off" length="short" direction="sup" rot="R90"/>
</symbol>
<symbol name="GND" urn="urn:adsk.eagle:symbol:26925/1" library_version="1">
<wire x1="-1.905" y1="0" x2="1.905" y2="0" width="0.254" layer="94"/>
<text x="-2.54" y="-2.54" size="1.778" layer="96">&gt;VALUE</text>
<pin name="GND" x="0" y="2.54" visible="off" length="short" direction="sup" rot="R270"/>
</symbol>
</symbols>
<devicesets>
<deviceset name="+3V3" urn="urn:adsk.eagle:component:26981/1" prefix="+3V3" library_version="1">
<description>&lt;b&gt;SUPPLY SYMBOL&lt;/b&gt;</description>
<gates>
<gate name="G$1" symbol="+3V3" x="0" y="0"/>
</gates>
<devices>
<device name="">
<technologies>
<technology name=""/>
</technologies>
</device>
</devices>
</deviceset>
<deviceset name="GND" urn="urn:adsk.eagle:component:26954/1" prefix="GND" library_version="1">
<description>&lt;b&gt;SUPPLY SYMBOL&lt;/b&gt;</description>
<gates>
<gate name="1" symbol="GND" x="0" y="0"/>
</gates>
<devices>
<device name="">
<technologies>
<technology name=""/>
</technologies>
</device>
</devices>
</deviceset>
</devicesets>
</library>
<library name="pinhead" urn="urn:adsk.eagle:library:325">
<description>&lt;b&gt;Pin Header Connectors&lt;/b&gt;&lt;p&gt;
&lt;author&gt;Created by librarian@cadsoft.de&lt;/author&gt;</description>
<packages>
<package name="1X03" urn="urn:adsk.eagle:footprint:22340/1" library_version="2">
<description>&lt;b&gt;PIN HEADER&lt;/b&gt;</description>
<wire x1="-3.175" y1="1.27" x2="-1.905" y2="1.27" width="0.1524" layer="21"/>
<wire x1="-1.905" y1="1.27" x2="-1.27" y2="0.635" width="0.1524" layer="21"/>
<wire x1="-1.27" y1="0.635" x2="-1.27" y2="-0.635" width="0.1524" layer="21"/>
<wire x1="-1.27" y1="-0.635" x2="-1.905" y2="-1.27" width="0.1524" layer="21"/>
<wire x1="-1.27" y1="0.635" x2="-0.635" y2="1.27" width="0.1524" layer="21"/>
<wire x1="-0.635" y1="1.27" x2="0.635" y2="1.27" width="0.1524" layer="21"/>
<wire x1="0.635" y1="1.27" x2="1.27" y2="0.635" width="0.1524" layer="21"/>
<wire x1="1.27" y1="0.635" x2="1.27" y2="-0.635" width="0.1524" layer="21"/>
<wire x1="1.27" y1="-0.635" x2="0.635" y2="-1.27" width="0.1524" layer="21"/>
<wire x1="0.635" y1="-1.27" x2="-0.635" y2="-1.27" width="0.1524" layer="21"/>
<wire x1="-0.635" y1="-1.27" x2="-1.27" y2="-0.635" width="0.1524" layer="21"/>
<wire x1="-3.81" y1="0.635" x2="-3.81" y2="-0.635" width="0.1524" layer="21"/>
<wire x1="-3.175" y1="1.27" x2="-3.81" y2="0.635" width="0.1524" layer="21"/>
<wire x1="-3.81" y1="-0.635" x2="-3.175" y2="-1.27" width="0.1524" layer="21"/>
<wire x1="-1.905" y1="-1.27" x2="-3.175" y2="-1.27" width="0.1524" layer="21"/>
<wire x1="1.27" y1="0.635" x2="1.905" y2="1.27" width="0.1524" layer="21"/>
<wire x1="1.905" y1="1.27" x2="3.175" y2="1.27" width="0.1524" layer="21"/>
<wire x1="3.175" y1="1.27" x2="3.81" y2="0.635" width="0.1524" layer="21"/>
<wire x1="3.81" y1="0.635" x2="3.81" y2="-0.635" width="0.1524" layer="21"/>
<wire x1="3.81" y1="-0.635" x2="3.175" y2="-1.27" width="0.1524" layer="21"/>
<wire x1="3.175" y1="-1.27" x2="1.905" y2="-1.27" width="0.1524" layer="21"/>
<wire x1="1.905" y1="-1.27" x2="1.27" y2="-0.635" width="0.1524" layer="21"/>
<pad name="1" x="-2.54" y="0" drill="1.016" shape="long" rot="R90"/>
<pad name="2" x="0" y="0" drill="1.016" shape="long" rot="R90"/>
<pad name="3" x="2.54" y="0" drill="1.016" shape="long" rot="R90"/>
<text x="-3.8862" y="1.8288" size="1.27" layer="25" ratio="10">&gt;NAME</text>
<text x="-3.81" y="-3.175" size="1.27" layer="27">&gt;VALUE</text>
<rectangle x1="-0.254" y1="-0.254" x2="0.254" y2="0.254" layer="51"/>
<rectangle x1="-2.794" y1="-0.254" x2="-2.286" y2="0.254" layer="51"/>
<rectangle x1="2.286" y1="-0.254" x2="2.794" y2="0.254" layer="51"/>
</package>
<package name="1X03/90" urn="urn:adsk.eagle:footprint:22341/1" library_version="2">
<description>&lt;b&gt;PIN HEADER&lt;/b&gt;</description>
<wire x1="-3.81" y1="-1.905" x2="-1.27" y2="-1.905" width="0.1524" layer="21"/>
<wire x1="-1.27" y1="-1.905" x2="-1.27" y2="0.635" width="0.1524" layer="21"/>
<wire x1="-1.27" y1="0.635" x2="-3.81" y2="0.635" width="0.1524" layer="21"/>
<wire x1="-3.81" y1="0.635" x2="-3.81" y2="-1.905" width="0.1524" layer="21"/>
<wire x1="-2.54" y1="6.985" x2="-2.54" y2="1.27" width="0.762" layer="21"/>
<wire x1="-1.27" y1="-1.905" x2="1.27" y2="-1.905" width="0.1524" layer="21"/>
<wire x1="1.27" y1="-1.905" x2="1.27" y2="0.635" width="0.1524" layer="21"/>
<wire x1="1.27" y1="0.635" x2="-1.27" y2="0.635" width="0.1524" layer="21"/>
<wire x1="0" y1="6.985" x2="0" y2="1.27" width="0.762" layer="21"/>
<wire x1="1.27" y1="-1.905" x2="3.81" y2="-1.905" width="0.1524" layer="21"/>
<wire x1="3.81" y1="-1.905" x2="3.81" y2="0.635" width="0.1524" layer="21"/>
<wire x1="3.81" y1="0.635" x2="1.27" y2="0.635" width="0.1524" layer="21"/>
<wire x1="2.54" y1="6.985" x2="2.54" y2="1.27" width="0.762" layer="21"/>
<pad name="1" x="-2.54" y="-3.81" drill="1.016" shape="long" rot="R90"/>
<pad name="2" x="0" y="-3.81" drill="1.016" shape="long" rot="R90"/>
<pad name="3" x="2.54" y="-3.81" drill="1.016" shape="long" rot="R90"/>
<text x="-4.445" y="-3.81" size="1.27" layer="25" ratio="10" rot="R90">&gt;NAME</text>
<text x="5.715" y="-3.81" size="1.27" layer="27" rot="R90">&gt;VALUE</text>
<rectangle x1="-2.921" y1="0.635" x2="-2.159" y2="1.143" layer="21"/>
<rectangle x1="-0.381" y1="0.635" x2="0.381" y2="1.143" layer="21"/>
<rectangle x1="2.159" y1="0.635" x2="2.921" y2="1.143" layer="21"/>
<rectangle x1="-2.921" y1="-2.921" x2="-2.159" y2="-1.905" layer="21"/>
<rectangle x1="-0.381" y1="-2.921" x2="0.381" y2="-1.905" layer="21"/>
<rectangle x1="2.159" y1="-2.921" x2="2.921" y2="-1.905" layer="21"/>
</package>
<package name="1X02" urn="urn:adsk.eagle:footprint:22309/1" library_version="2">
<description>&lt;b&gt;PIN HEADER&lt;/b&gt;</description>
<wire x1="-1.905" y1="1.27" x2="-0.635" y2="1.27" width="0.1524" layer="21"/>
<wire x1="-0.635" y1="1.27" x2="0" y2="0.635" width="0.1524" layer="21"/>
<wire x1="0" y1="0.635" x2="0" y2="-0.635" width="0.1524" layer="21"/>
<wire x1="0" y1="-0.635" x2="-0.635" y2="-1.27" width="0.1524" layer="21"/>
<wire x1="-2.54" y1="0.635" x2="-2.54" y2="-0.635" width="0.1524" layer="21"/>
<wire x1="-1.905" y1="1.27" x2="-2.54" y2="0.635" width="0.1524" layer="21"/>
<wire x1="-2.54" y1="-0.635" x2="-1.905" y2="-1.27" width="0.1524" layer="21"/>
<wire x1="-0.635" y1="-1.27" x2="-1.905" y2="-1.27" width="0.1524" layer="21"/>
<wire x1="0" y1="0.635" x2="0.635" y2="1.27" width="0.1524" layer="21"/>
<wire x1="0.635" y1="1.27" x2="1.905" y2="1.27" width="0.1524" layer="21"/>
<wire x1="1.905" y1="1.27" x2="2.54" y2="0.635" width="0.1524" layer="21"/>
<wire x1="2.54" y1="0.635" x2="2.54" y2="-0.635" width="0.1524" layer="21"/>
<wire x1="2.54" y1="-0.635" x2="1.905" y2="-1.27" width="0.1524" layer="21"/>
<wire x1="1.905" y1="-1.27" x2="0.635" y2="-1.27" width="0.1524" layer="21"/>
<wire x1="0.635" y1="-1.27" x2="0" y2="-0.635" width="0.1524" layer="21"/>
<pad name="1" x="-1.27" y="0" drill="1.016" shape="long" rot="R90"/>
<pad name="2" x="1.27" y="0" drill="1.016" shape="long" rot="R90"/>
<text x="-2.6162" y="1.8288" size="1.27" layer="25" ratio="10">&gt;NAME</text>
<text x="-2.54" y="-3.175" size="1.27" layer="27">&gt;VALUE</text>
<rectangle x1="-1.524" y1="-0.254" x2="-1.016" y2="0.254" layer="51"/>
<rectangle x1="1.016" y1="-0.254" x2="1.524" y2="0.254" layer="51"/>
</package>
<package name="1X02/90" urn="urn:adsk.eagle:footprint:22310/1" library_version="2">
<description>&lt;b&gt;PIN HEADER&lt;/b&gt;</description>
<wire x1="-2.54" y1="-1.905" x2="0" y2="-1.905" width="0.1524" layer="21"/>
<wire x1="0" y1="-1.905" x2="0" y2="0.635" width="0.1524" layer="21"/>
<wire x1="0" y1="0.635" x2="-2.54" y2="0.635" width="0.1524" layer="21"/>
<wire x1="-2.54" y1="0.635" x2="-2.54" y2="-1.905" width="0.1524" layer="21"/>
<wire x1="-1.27" y1="6.985" x2="-1.27" y2="1.27" width="0.762" layer="21"/>
<wire x1="0" y1="-1.905" x2="2.54" y2="-1.905" width="0.1524" layer="21"/>
<wire x1="2.54" y1="-1.905" x2="2.54" y2="0.635" width="0.1524" layer="21"/>
<wire x1="2.54" y1="0.635" x2="0" y2="0.635" width="0.1524" layer="21"/>
<wire x1="1.27" y1="6.985" x2="1.27" y2="1.27" width="0.762" layer="21"/>
<pad name="1" x="-1.27" y="-3.81" drill="1.016" shape="long" rot="R90"/>
<pad name="2" x="1.27" y="-3.81" drill="1.016" shape="long" rot="R90"/>
<text x="-3.175" y="-3.81" size="1.27" layer="25" ratio="10" rot="R90">&gt;NAME</text>
<text x="4.445" y="-3.81" size="1.27" layer="27" rot="R90">&gt;VALUE</text>
<rectangle x1="-1.651" y1="0.635" x2="-0.889" y2="1.143" layer="21"/>
<rectangle x1="0.889" y1="0.635" x2="1.651" y2="1.143" layer="21"/>
<rectangle x1="-1.651" y1="-2.921" x2="-0.889" y2="-1.905" layer="21"/>
<rectangle x1="0.889" y1="-2.921" x2="1.651" y2="-1.905" layer="21"/>
</package>
</packages>
<packages3d>
<package3d name="1X03" urn="urn:adsk.eagle:package:22458/2" type="model" library_version="2">
<description>PIN HEADER</description>
</package3d>
<package3d name="1X03/90" urn="urn:adsk.eagle:package:22459/1" type="box" library_version="2">
<description>PIN HEADER</description>
</package3d>
<package3d name="1X02" urn="urn:adsk.eagle:package:22435/2" type="model" library_version="2">
<description>PIN HEADER</description>
</package3d>
<package3d name="1X02/90" urn="urn:adsk.eagle:package:22437/1" type="box" library_version="2">
<description>PIN HEADER</description>
</package3d>
</packages3d>
<symbols>
<symbol name="PINHD3" urn="urn:adsk.eagle:symbol:22339/1" library_version="2">
<wire x1="-6.35" y1="-5.08" x2="1.27" y2="-5.08" width="0.4064" layer="94"/>
<wire x1="1.27" y1="-5.08" x2="1.27" y2="5.08" width="0.4064" layer="94"/>
<wire x1="1.27" y1="5.08" x2="-6.35" y2="5.08" width="0.4064" layer="94"/>
<wire x1="-6.35" y1="5.08" x2="-6.35" y2="-5.08" width="0.4064" layer="94"/>
<text x="-6.35" y="5.715" size="1.778" layer="95">&gt;NAME</text>
<text x="-6.35" y="-7.62" size="1.778" layer="96">&gt;VALUE</text>
<pin name="1" x="-2.54" y="2.54" visible="pad" length="short" direction="pas" function="dot"/>
<pin name="2" x="-2.54" y="0" visible="pad" length="short" direction="pas" function="dot"/>
<pin name="3" x="-2.54" y="-2.54" visible="pad" length="short" direction="pas" function="dot"/>
</symbol>
<symbol name="PINHD2" urn="urn:adsk.eagle:symbol:22308/1" library_version="2">
<wire x1="-6.35" y1="-2.54" x2="1.27" y2="-2.54" width="0.4064" layer="94"/>
<wire x1="1.27" y1="-2.54" x2="1.27" y2="5.08" width="0.4064" layer="94"/>
<wire x1="1.27" y1="5.08" x2="-6.35" y2="5.08" width="0.4064" layer="94"/>
<wire x1="-6.35" y1="5.08" x2="-6.35" y2="-2.54" width="0.4064" layer="94"/>
<text x="-6.35" y="5.715" size="1.778" layer="95">&gt;NAME</text>
<text x="-6.35" y="-5.08" size="1.778" layer="96">&gt;VALUE</text>
<pin name="1" x="-2.54" y="2.54" visible="pad" length="short" direction="pas" function="dot"/>
<pin name="2" x="-2.54" y="0" visible="pad" length="short" direction="pas" function="dot"/>
</symbol>
</symbols>
<devicesets>
<deviceset name="PINHD-1X3" urn="urn:adsk.eagle:component:22524/2" prefix="JP" uservalue="yes" library_version="2">
<description>&lt;b&gt;PIN HEADER&lt;/b&gt;</description>
<gates>
<gate name="A" symbol="PINHD3" x="0" y="0"/>
</gates>
<devices>
<device name="" package="1X03">
<connects>
<connect gate="A" pin="1" pad="1"/>
<connect gate="A" pin="2" pad="2"/>
<connect gate="A" pin="3" pad="3"/>
</connects>
<package3dinstances>
<package3dinstance package3d_urn="urn:adsk.eagle:package:22458/2"/>
</package3dinstances>
<technologies>
<technology name=""/>
</technologies>
</device>
<device name="/90" package="1X03/90">
<connects>
<connect gate="A" pin="1" pad="1"/>
<connect gate="A" pin="2" pad="2"/>
<connect gate="A" pin="3" pad="3"/>
</connects>
<package3dinstances>
<package3dinstance package3d_urn="urn:adsk.eagle:package:22459/1"/>
</package3dinstances>
<technologies>
<technology name=""/>
</technologies>
</device>
</devices>
</deviceset>
<deviceset name="PINHD-1X2" urn="urn:adsk.eagle:component:22516/2" prefix="JP" uservalue="yes" library_version="2">
<description>&lt;b&gt;PIN HEADER&lt;/b&gt;</description>
<gates>
<gate name="G$1" symbol="PINHD2" x="0" y="0"/>
</gates>
<devices>
<device name="" package="1X02">
<connects>
<connect gate="G$1" pin="1" pad="1"/>
<connect gate="G$1" pin="2" pad="2"/>
</connects>
<package3dinstances>
<package3dinstance package3d_urn="urn:adsk.eagle:package:22435/2"/>
</package3dinstances>
<technologies>
<technology name=""/>
</technologies>
</device>
<device name="/90" package="1X02/90">
<connects>
<connect gate="G$1" pin="1" pad="1"/>
<connect gate="G$1" pin="2" pad="2"/>
</connects>
<package3dinstances>
<package3dinstance package3d_urn="urn:adsk.eagle:package:22437/1"/>
</package3dinstances>
<technologies>
<technology name=""/>
</technologies>
</device>
</devices>
</deviceset>
</devicesets>
</library>
<library name="borkedlabs-passives">
<packages>
<package name="0805">
<wire x1="-0.3" y1="0.6" x2="0.3" y2="0.6" width="0.1524" layer="21"/>
<wire x1="-0.3" y1="-0.6" x2="0.3" y2="-0.6" width="0.1524" layer="21"/>
<smd name="1" x="-0.9" y="0" dx="0.8" dy="1.2" layer="1"/>
<smd name="2" x="0.9" y="0" dx="0.8" dy="1.2" layer="1"/>
<text x="-0.762" y="0.8255" size="1.016" layer="25">&gt;NAME</text>
<text x="-1.016" y="-2.032" size="1.016" layer="27">&gt;VALUE</text>
</package>
<package name="0603-CAP">
<wire x1="-1.473" y1="0.983" x2="1.473" y2="0.983" width="0.0508" layer="39"/>
<wire x1="1.473" y1="0.983" x2="1.473" y2="-0.983" width="0.0508" layer="39"/>
<wire x1="1.473" y1="-0.983" x2="-1.473" y2="-0.983" width="0.0508" layer="39"/>
<wire x1="-1.473" y1="-0.983" x2="-1.473" y2="0.983" width="0.0508" layer="39"/>
<wire x1="-0.356" y1="0.432" x2="0.356" y2="0.432" width="0.1016" layer="51"/>
<wire x1="-0.356" y1="-0.419" x2="0.356" y2="-0.419" width="0.1016" layer="51"/>
<wire x1="0" y1="0.0305" x2="0" y2="-0.0305" width="0.5588" layer="21"/>
<smd name="1" x="-0.85" y="0" dx="1.1" dy="1" layer="1"/>
<smd name="2" x="0.85" y="0" dx="1.1" dy="1" layer="1"/>
<text x="-0.889" y="1.397" size="1.016" layer="25">&gt;NAME</text>
<text x="-1.016" y="-2.413" size="1.016" layer="27">&gt;VALUE</text>
<rectangle x1="-0.8382" y1="-0.4699" x2="-0.3381" y2="0.4801" layer="51"/>
<rectangle x1="0.3302" y1="-0.4699" x2="0.8303" y2="0.4801" layer="51"/>
<rectangle x1="-0.1999" y1="-0.3" x2="0.1999" y2="0.3" layer="35"/>
</package>
<package name="0402-CAP">
<description>&lt;b&gt;CAPACITOR&lt;/b&gt;&lt;p&gt;
chip</description>
<wire x1="-0.245" y1="0.224" x2="0.245" y2="0.224" width="0.1524" layer="51"/>
<wire x1="0.245" y1="-0.224" x2="-0.245" y2="-0.224" width="0.1524" layer="51"/>
<wire x1="-1.473" y1="0.483" x2="1.473" y2="0.483" width="0.0508" layer="39"/>
<wire x1="1.473" y1="0.483" x2="1.473" y2="-0.483" width="0.0508" layer="39"/>
<wire x1="1.473" y1="-0.483" x2="-1.473" y2="-0.483" width="0.0508" layer="39"/>
<wire x1="-1.473" y1="-0.483" x2="-1.473" y2="0.483" width="0.0508" layer="39"/>
<wire x1="0" y1="0.0305" x2="0" y2="-0.0305" width="0.4064" layer="21"/>
<smd name="1" x="-0.65" y="0" dx="0.7" dy="0.9" layer="1"/>
<smd name="2" x="0.65" y="0" dx="0.7" dy="0.9" layer="1"/>
<text x="-0.889" y="0.6985" size="1.016" layer="25">&gt;NAME</text>
<text x="-1.0795" y="-2.413" size="1.016" layer="27">&gt;VALUE</text>
<rectangle x1="-0.554" y1="-0.3048" x2="-0.254" y2="0.2951" layer="51"/>
<rectangle x1="0.2588" y1="-0.3048" x2="0.5588" y2="0.2951" layer="51"/>
<rectangle x1="-0.1999" y1="-0.3" x2="0.1999" y2="0.3" layer="35"/>
</package>
<package name="1210">
<wire x1="-1.6" y1="1.3" x2="1.6" y2="1.3" width="0.127" layer="51"/>
<wire x1="1.6" y1="1.3" x2="1.6" y2="-1.3" width="0.127" layer="51"/>
<wire x1="1.6" y1="-1.3" x2="-1.6" y2="-1.3" width="0.127" layer="51"/>
<wire x1="-1.6" y1="-1.3" x2="-1.6" y2="1.3" width="0.127" layer="51"/>
<wire x1="-1.6" y1="1.3" x2="1.6" y2="1.3" width="0.2032" layer="21"/>
<wire x1="-1.6" y1="-1.3" x2="1.6" y2="-1.3" width="0.2032" layer="21"/>
<smd name="1" x="-1.6" y="0" dx="1.2" dy="2" layer="1"/>
<smd name="2" x="1.6" y="0" dx="1.2" dy="2" layer="1"/>
<text x="-2.07" y="1.77" size="1.016" layer="25">&gt;NAME</text>
<text x="-2.17" y="-3.24" size="1.016" layer="27">&gt;VALUE</text>
</package>
<package name="1206">
<wire x1="-2.473" y1="0.983" x2="2.473" y2="0.983" width="0.0508" layer="39"/>
<wire x1="2.473" y1="-0.983" x2="-2.473" y2="-0.983" width="0.0508" layer="39"/>
<wire x1="-2.473" y1="-0.983" x2="-2.473" y2="0.983" width="0.0508" layer="39"/>
<wire x1="2.473" y1="0.983" x2="2.473" y2="-0.983" width="0.0508" layer="39"/>
<wire x1="-0.965" y1="0.787" x2="0.965" y2="0.787" width="0.1016" layer="51"/>
<wire x1="-0.965" y1="-0.787" x2="0.965" y2="-0.787" width="0.1016" layer="51"/>
<smd name="1" x="-1.4" y="0" dx="1.6" dy="1.8" layer="1"/>
<smd name="2" x="1.4" y="0" dx="1.6" dy="1.8" layer="1"/>
<text x="-1.27" y="1.143" size="1.016" layer="25">&gt;NAME</text>
<text x="-1.397" y="-2.794" size="1.016" layer="27">&gt;VALUE</text>
<rectangle x1="-1.7018" y1="-0.8509" x2="-0.9517" y2="0.8491" layer="51"/>
<rectangle x1="0.9517" y1="-0.8491" x2="1.7018" y2="0.8509" layer="51"/>
<rectangle x1="-0.1999" y1="-0.4001" x2="0.1999" y2="0.4001" layer="35"/>
<wire x1="-0.435" y1="0.635" x2="0.435" y2="0.635" width="0.127" layer="21"/>
<wire x1="-0.435" y1="-0.635" x2="0.435" y2="-0.635" width="0.127" layer="21"/>
</package>
</packages>
<symbols>
<symbol name="CAP">
<wire x1="0" y1="2.54" x2="0" y2="2.032" width="0.1524" layer="94"/>
<wire x1="0" y1="0" x2="0" y2="0.508" width="0.1524" layer="94"/>
<text x="1.524" y="2.921" size="1.778" layer="95">&gt;NAME</text>
<text x="1.524" y="-2.159" size="1.778" layer="96">&gt;VALUE</text>
<rectangle x1="-2.032" y1="0.508" x2="2.032" y2="1.016" layer="94"/>
<rectangle x1="-2.032" y1="1.524" x2="2.032" y2="2.032" layer="94"/>
<pin name="1" x="0" y="5.08" visible="off" length="short" direction="pas" swaplevel="1" rot="R270"/>
<pin name="2" x="0" y="-2.54" visible="off" length="short" direction="pas" swaplevel="1" rot="R90"/>
<text x="1.524" y="-4.064" size="1.27" layer="97">&gt;PACKAGE</text>
<text x="1.524" y="-5.842" size="1.27" layer="97">&gt;VOLTAGE</text>
<text x="1.524" y="-7.62" size="1.27" layer="97">&gt;TYPE</text>
</symbol>
</symbols>
<devicesets>
<deviceset name="CAP" prefix="C" uservalue="yes">
<description>&lt;b&gt;Capacitor&lt;/b&gt;
Standard 0603 ceramic capacitor, and 0.1" leaded capacitor.</description>
<gates>
<gate name="G$1" symbol="CAP" x="0" y="0"/>
</gates>
<devices>
<device name="0805" package="0805">
<connects>
<connect gate="G$1" pin="1" pad="1"/>
<connect gate="G$1" pin="2" pad="2"/>
</connects>
<technologies>
<technology name="">
<attribute name="PACKAGE" value="0805"/>
<attribute name="TYPE" value="" constant="no"/>
<attribute name="VOLTAGE" value="" constant="no"/>
</technology>
</technologies>
</device>
<device name="0603-CAP" package="0603-CAP">
<connects>
<connect gate="G$1" pin="1" pad="1"/>
<connect gate="G$1" pin="2" pad="2"/>
</connects>
<technologies>
<technology name="">
<attribute name="PACKAGE" value="0603"/>
<attribute name="TYPE" value="" constant="no"/>
<attribute name="VOLTAGE" value="" constant="no"/>
</technology>
</technologies>
</device>
<device name="0402-CAP" package="0402-CAP">
<connects>
<connect gate="G$1" pin="1" pad="1"/>
<connect gate="G$1" pin="2" pad="2"/>
</connects>
<technologies>
<technology name="">
<attribute name="PACKAGE" value="0402"/>
<attribute name="TYPE" value="" constant="no"/>
<attribute name="VOLTAGE" value="" constant="no"/>
</technology>
</technologies>
</device>
<device name="1210" package="1210">
<connects>
<connect gate="G$1" pin="1" pad="1"/>
<connect gate="G$1" pin="2" pad="2"/>
</connects>
<technologies>
<technology name="">
<attribute name="PACKAGE" value="1210" constant="no"/>
<attribute name="TYPE" value="" constant="no"/>
<attribute name="VOLTAGE" value="" constant="no"/>
</technology>
</technologies>
</device>
<device name="1206" package="1206">
<connects>
<connect gate="G$1" pin="1" pad="1"/>
<connect gate="G$1" pin="2" pad="2"/>
</connects>
<technologies>
<technology name="">
<attribute name="PACKAGE" value="1206" constant="no"/>
<attribute name="TYPE" value="" constant="no"/>
<attribute name="VOLTAGE" value="" constant="no"/>
</technology>
</technologies>
</device>
</devices>
</deviceset>
</devicesets>
</library>
</libraries>
<attributes>
</attributes>
<variantdefs>
</variantdefs>
<classes>
<class number="0" name="default" width="0" drill="0">
</class>
</classes>
<parts>
<part name="U1" library="fab" deviceset="ISL3177E" device="MILL" value="ISL3177EMILL"/>
<part name="J2" library="fab" deviceset="CONN_04X2" device="SHROUDED-SQUISH"/>
<part name="GND1" library="supply1" library_urn="urn:adsk.eagle:library:371" deviceset="GND" device=""/>
<part name="+3V2" library="supply1" library_urn="urn:adsk.eagle:library:371" deviceset="+3V3" device=""/>
<part name="C2" library="borkedlabs-passives" deviceset="CAP" device="0805" value="0.47uF"/>
<part name="GND2" library="supply1" library_urn="urn:adsk.eagle:library:371" deviceset="GND" device=""/>
<part name="+3V3" library="supply1" library_urn="urn:adsk.eagle:library:371" deviceset="+3V3" device=""/>
<part name="+3V4" library="supply1" library_urn="urn:adsk.eagle:library:371" deviceset="+3V3" device=""/>
<part name="C3" library="borkedlabs-passives" deviceset="CAP" device="0805" value="1uF"/>
<part name="C4" library="borkedlabs-passives" deviceset="CAP" device="0805" value="22uF"/>
<part name="X1" library="fab" deviceset="MICRO-USB" device="_1/64"/>
<part name="U$1" library="fab" deviceset="XR21V410-USB-UART" device=""/>
<part name="GND3" library="supply1" library_urn="urn:adsk.eagle:library:371" deviceset="GND" device=""/>
<part name="+3V5" library="supply1" library_urn="urn:adsk.eagle:library:371" deviceset="+3V3" device=""/>
<part name="GND4" library="supply1" library_urn="urn:adsk.eagle:library:371" deviceset="GND" device=""/>
<part name="GND5" library="supply1" library_urn="urn:adsk.eagle:library:371" deviceset="GND" device=""/>
<part name="GND6" library="supply1" library_urn="urn:adsk.eagle:library:371" deviceset="GND" device=""/>
<part name="U2" library="fab" deviceset="REGULATOR_SOT223" device=""/>
<part name="GND7" library="supply1" library_urn="urn:adsk.eagle:library:371" deviceset="GND" device=""/>
<part name="+3V6" library="supply1" library_urn="urn:adsk.eagle:library:371" deviceset="+3V3" device=""/>
<part name="JP1" library="pinhead" library_urn="urn:adsk.eagle:library:325" deviceset="PINHD-1X3" device="" package3d_urn="urn:adsk.eagle:package:22458/2"/>
<part name="C1" library="borkedlabs-passives" deviceset="CAP" device="0805" value="22uF"/>
<part name="C5" library="borkedlabs-passives" deviceset="CAP" device="0805" value="22uF"/>
<part name="C6" library="borkedlabs-passives" deviceset="CAP" device="0805" value="22uF"/>
<part name="C7" library="borkedlabs-passives" deviceset="CAP" device="0805" value="22uF"/>
<part name="GND8" library="supply1" library_urn="urn:adsk.eagle:library:371" deviceset="GND" device=""/>
<part name="GND9" library="supply1" library_urn="urn:adsk.eagle:library:371" deviceset="GND" device=""/>
<part name="JP2" library="pinhead" library_urn="urn:adsk.eagle:library:325" deviceset="PINHD-1X2" device="" package3d_urn="urn:adsk.eagle:package:22435/2"/>
<part name="GND10" library="supply1" library_urn="urn:adsk.eagle:library:371" deviceset="GND" device=""/>
<part name="C8" library="borkedlabs-passives" deviceset="CAP" device="0805" value="0.47uF"/>
<part name="GND11" library="supply1" library_urn="urn:adsk.eagle:library:371" deviceset="GND" device=""/>
</parts>
<sheets>
<sheet>
<plain>
</plain>
<instances>
<instance part="U1" gate="G$1" x="116.84" y="30.48"/>
<instance part="J2" gate="G$1" x="152.4" y="30.48"/>
<instance part="GND1" gate="1" x="167.64" y="22.86"/>
<instance part="+3V2" gate="G$1" x="101.6" y="40.64"/>
<instance part="C2" gate="G$1" x="96.52" y="25.4" rot="R180"/>
<instance part="GND2" gate="1" x="142.24" y="40.64" rot="R180"/>
<instance part="+3V3" gate="G$1" x="167.64" y="40.64"/>
<instance part="+3V4" gate="G$1" x="142.24" y="22.86" rot="R180"/>
<instance part="C3" gate="G$1" x="167.64" y="33.02" rot="R180"/>
<instance part="C4" gate="G$1" x="175.26" y="33.02" rot="R180"/>
<instance part="X1" gate="G$1" x="58.42" y="81.28" rot="R270"/>
<instance part="U$1" gate="G$1" x="50.8" y="40.64"/>
<instance part="GND3" gate="1" x="60.96" y="15.24"/>
<instance part="+3V5" gate="G$1" x="71.12" y="68.58"/>
<instance part="GND4" gate="1" x="81.28" y="40.64" rot="R90"/>
<instance part="GND5" gate="1" x="25.4" y="48.26" rot="R270"/>
<instance part="GND6" gate="1" x="68.58" y="88.9" rot="R180"/>
<instance part="U2" gate="G$1" x="109.22" y="78.74"/>
<instance part="GND7" gate="1" x="109.22" y="68.58"/>
<instance part="+3V6" gate="G$1" x="165.1" y="91.44" rot="R270"/>
<instance part="JP1" gate="A" x="129.54" y="91.44" rot="R180"/>
<instance part="C1" gate="G$1" x="144.78" y="88.9" rot="R180"/>
<instance part="C5" gate="G$1" x="149.86" y="88.9" rot="R180"/>
<instance part="C6" gate="G$1" x="154.94" y="88.9" rot="R180"/>
<instance part="C7" gate="G$1" x="93.98" y="78.74" rot="R180"/>
<instance part="GND8" gate="1" x="93.98" y="68.58"/>
<instance part="GND9" gate="1" x="144.78" y="68.58"/>
<instance part="JP2" gate="G$1" x="149.86" y="104.14"/>
<instance part="GND10" gate="1" x="139.7" y="111.76" rot="R180"/>
<instance part="C8" gate="G$1" x="66.04" y="60.96" rot="R270"/>
<instance part="GND11" gate="1" x="58.42" y="60.96" rot="R270"/>
</instances>
<busses>
</busses>
<nets>
<net name="N$1" class="0">
<segment>
<pinref part="U1" gate="G$1" pin="RO"/>
<wire x1="68.58" y1="33.02" x2="104.14" y2="33.02" width="0.1524" layer="91"/>
<pinref part="U$1" gate="G$1" pin="RX"/>
</segment>
</net>
<net name="N$2" class="0">
<segment>
<pinref part="U1" gate="G$1" pin="DI"/>
<wire x1="104.14" y1="30.48" x2="68.58" y2="30.48" width="0.1524" layer="91"/>
<pinref part="U$1" gate="G$1" pin="TX"/>
</segment>
</net>
<net name="+3V3" class="0">
<segment>
<pinref part="+3V2" gate="G$1" pin="+3V3"/>
<wire x1="101.6" y1="38.1" x2="101.6" y2="35.56" width="0.1524" layer="91"/>
<pinref part="U1" gate="G$1" pin="VCC"/>
<wire x1="101.6" y1="35.56" x2="104.14" y2="35.56" width="0.1524" layer="91"/>
<pinref part="C2" gate="G$1" pin="2"/>
<wire x1="96.52" y1="27.94" x2="96.52" y2="35.56" width="0.1524" layer="91"/>
<wire x1="96.52" y1="35.56" x2="101.6" y2="35.56" width="0.1524" layer="91"/>
<junction x="101.6" y="35.56"/>
</segment>
<segment>
<pinref part="J2" gate="G$1" pin="7"/>
<pinref part="+3V4" gate="G$1" pin="+3V3"/>
<wire x1="144.78" y1="27.94" x2="142.24" y2="27.94" width="0.1524" layer="91"/>
<wire x1="142.24" y1="27.94" x2="142.24" y2="25.4" width="0.1524" layer="91"/>
</segment>
<segment>
<pinref part="J2" gate="G$1" pin="2"/>
<pinref part="C3" gate="G$1" pin="2"/>
<wire x1="160.02" y1="35.56" x2="167.64" y2="35.56" width="0.1524" layer="91"/>
<pinref part="C4" gate="G$1" pin="2"/>
<wire x1="167.64" y1="35.56" x2="175.26" y2="35.56" width="0.1524" layer="91"/>
<junction x="167.64" y="35.56"/>
<pinref part="+3V3" gate="G$1" pin="+3V3"/>
<wire x1="167.64" y1="35.56" x2="167.64" y2="38.1" width="0.1524" layer="91"/>
</segment>
<segment>
<pinref part="U$1" gate="G$1" pin="VCC"/>
<pinref part="+3V5" gate="G$1" pin="+3V3"/>
<wire x1="68.58" y1="48.26" x2="71.12" y2="48.26" width="0.1524" layer="91"/>
<wire x1="71.12" y1="48.26" x2="71.12" y2="60.96" width="0.1524" layer="91"/>
<pinref part="C8" gate="G$1" pin="1"/>
<wire x1="71.12" y1="60.96" x2="71.12" y2="66.04" width="0.1524" layer="91"/>
<junction x="71.12" y="60.96"/>
</segment>
<segment>
<pinref part="JP1" gate="A" pin="2"/>
<pinref part="C1" gate="G$1" pin="2"/>
<wire x1="132.08" y1="91.44" x2="144.78" y2="91.44" width="0.1524" layer="91"/>
<pinref part="C5" gate="G$1" pin="2"/>
<wire x1="144.78" y1="91.44" x2="149.86" y2="91.44" width="0.1524" layer="91"/>
<junction x="144.78" y="91.44"/>
<pinref part="C6" gate="G$1" pin="2"/>
<wire x1="149.86" y1="91.44" x2="154.94" y2="91.44" width="0.1524" layer="91"/>
<junction x="149.86" y="91.44"/>
<pinref part="+3V6" gate="G$1" pin="+3V3"/>
<wire x1="154.94" y1="91.44" x2="162.56" y2="91.44" width="0.1524" layer="91"/>
<junction x="154.94" y="91.44"/>
</segment>
</net>
<net name="N$4" class="0">
<segment>
<pinref part="U1" gate="G$1" pin="A"/>
<wire x1="129.54" y1="35.56" x2="139.7" y2="35.56" width="0.1524" layer="91"/>
<wire x1="139.7" y1="35.56" x2="139.7" y2="33.02" width="0.1524" layer="91"/>
<pinref part="J2" gate="G$1" pin="3"/>
<wire x1="139.7" y1="33.02" x2="144.78" y2="33.02" width="0.1524" layer="91"/>
</segment>
</net>
<net name="N$5" class="0">
<segment>
<pinref part="U1" gate="G$1" pin="B"/>
<wire x1="129.54" y1="33.02" x2="138.43" y2="33.02" width="0.1524" layer="91"/>
<wire x1="138.43" y1="33.02" x2="138.43" y2="31.75" width="0.1524" layer="91"/>
<wire x1="138.43" y1="31.75" x2="161.29" y2="31.75" width="0.1524" layer="91"/>
<wire x1="161.29" y1="31.75" x2="161.29" y2="33.02" width="0.1524" layer="91"/>
<pinref part="J2" gate="G$1" pin="4"/>
<wire x1="161.29" y1="33.02" x2="160.02" y2="33.02" width="0.1524" layer="91"/>
</segment>
</net>
<net name="N$6" class="0">
<segment>
<pinref part="U1" gate="G$1" pin="Z"/>
<pinref part="J2" gate="G$1" pin="5"/>
<wire x1="129.54" y1="30.48" x2="144.78" y2="30.48" width="0.1524" layer="91"/>
</segment>
</net>
<net name="N$7" class="0">
<segment>
<pinref part="U1" gate="G$1" pin="Y"/>
<wire x1="129.54" y1="27.94" x2="138.43" y2="27.94" width="0.1524" layer="91"/>
<wire x1="138.43" y1="27.94" x2="138.43" y2="29.21" width="0.1524" layer="91"/>
<wire x1="138.43" y1="29.21" x2="161.29" y2="29.21" width="0.1524" layer="91"/>
<wire x1="161.29" y1="29.21" x2="161.29" y2="30.48" width="0.1524" layer="91"/>
<pinref part="J2" gate="G$1" pin="6"/>
<wire x1="161.29" y1="30.48" x2="160.02" y2="30.48" width="0.1524" layer="91"/>
</segment>
</net>
<net name="GND" class="0">
<segment>
<pinref part="J2" gate="G$1" pin="1"/>
<pinref part="GND2" gate="1" pin="GND"/>
<wire x1="144.78" y1="35.56" x2="142.24" y2="35.56" width="0.1524" layer="91"/>
<wire x1="142.24" y1="35.56" x2="142.24" y2="38.1" width="0.1524" layer="91"/>
</segment>
<segment>
<pinref part="J2" gate="G$1" pin="8"/>
<pinref part="C3" gate="G$1" pin="1"/>
<wire x1="160.02" y1="27.94" x2="167.64" y2="27.94" width="0.1524" layer="91"/>
<pinref part="C4" gate="G$1" pin="1"/>
<wire x1="167.64" y1="27.94" x2="175.26" y2="27.94" width="0.1524" layer="91"/>
<junction x="167.64" y="27.94"/>
<pinref part="GND1" gate="1" pin="GND"/>
<wire x1="167.64" y1="27.94" x2="167.64" y2="25.4" width="0.1524" layer="91"/>
</segment>
<segment>
<pinref part="U1" gate="G$1" pin="GND"/>
<wire x1="96.52" y1="20.32" x2="104.14" y2="20.32" width="0.1524" layer="91"/>
<wire x1="104.14" y1="20.32" x2="104.14" y2="27.94" width="0.1524" layer="91"/>
<pinref part="C2" gate="G$1" pin="1"/>
<junction x="96.52" y="20.32"/>
<label x="101.6" y="20.32" size="1.778" layer="95"/>
<pinref part="GND3" gate="1" pin="GND"/>
<wire x1="96.52" y1="20.32" x2="60.96" y2="20.32" width="0.1524" layer="91"/>
<wire x1="60.96" y1="20.32" x2="60.96" y2="17.78" width="0.1524" layer="91"/>
<pinref part="U$1" gate="G$1" pin="GND_PAD"/>
<wire x1="50.8" y1="22.86" x2="50.8" y2="20.32" width="0.1524" layer="91"/>
<wire x1="50.8" y1="20.32" x2="60.96" y2="20.32" width="0.1524" layer="91"/>
<junction x="60.96" y="20.32"/>
</segment>
<segment>
<pinref part="U$1" gate="G$1" pin="GND1"/>
<pinref part="GND5" gate="1" pin="GND"/>
<wire x1="33.02" y1="48.26" x2="27.94" y2="48.26" width="0.1524" layer="91"/>
</segment>
<segment>
<pinref part="U$1" gate="G$1" pin="GND2"/>
<pinref part="GND4" gate="1" pin="GND"/>
<wire x1="68.58" y1="40.64" x2="78.74" y2="40.64" width="0.1524" layer="91"/>
</segment>
<segment>
<pinref part="X1" gate="G$1" pin="GND"/>
<pinref part="GND6" gate="1" pin="GND"/>
<wire x1="63.5" y1="83.82" x2="68.58" y2="83.82" width="0.1524" layer="91"/>
<wire x1="68.58" y1="83.82" x2="68.58" y2="86.36" width="0.1524" layer="91"/>
</segment>
<segment>
<pinref part="GND7" gate="1" pin="GND"/>
<pinref part="U2" gate="G$1" pin="GND"/>
<wire x1="109.22" y1="71.12" x2="109.22" y2="76.2" width="0.1524" layer="91"/>
</segment>
<segment>
<pinref part="C7" gate="G$1" pin="1"/>
<pinref part="GND8" gate="1" pin="GND"/>
<wire x1="93.98" y1="71.12" x2="93.98" y2="73.66" width="0.1524" layer="91"/>
</segment>
<segment>
<pinref part="C6" gate="G$1" pin="1"/>
<pinref part="C5" gate="G$1" pin="1"/>
<wire x1="154.94" y1="83.82" x2="149.86" y2="83.82" width="0.1524" layer="91"/>
<pinref part="C1" gate="G$1" pin="1"/>
<wire x1="149.86" y1="83.82" x2="144.78" y2="83.82" width="0.1524" layer="91"/>
<junction x="149.86" y="83.82"/>
<pinref part="GND9" gate="1" pin="GND"/>
<wire x1="144.78" y1="83.82" x2="144.78" y2="71.12" width="0.1524" layer="91"/>
<junction x="144.78" y="83.82"/>
</segment>
<segment>
<pinref part="GND10" gate="1" pin="GND"/>
<wire x1="139.7" y1="109.22" x2="139.7" y2="106.68" width="0.1524" layer="91"/>
<pinref part="JP2" gate="G$1" pin="1"/>
<wire x1="139.7" y1="106.68" x2="147.32" y2="106.68" width="0.1524" layer="91"/>
</segment>
<segment>
<pinref part="C8" gate="G$1" pin="2"/>
<pinref part="GND11" gate="1" pin="GND"/>
<wire x1="60.96" y1="60.96" x2="63.5" y2="60.96" width="0.1524" layer="91"/>
</segment>
</net>
<net name="N$8" class="0">
<segment>
<pinref part="X1" gate="G$1" pin="D+"/>
<wire x1="63.5" y1="76.2" x2="73.66" y2="76.2" width="0.1524" layer="91"/>
<wire x1="73.66" y1="76.2" x2="73.66" y2="45.72" width="0.1524" layer="91"/>
<pinref part="U$1" gate="G$1" pin="USBD+"/>
<wire x1="73.66" y1="45.72" x2="68.58" y2="45.72" width="0.1524" layer="91"/>
</segment>
</net>
<net name="N$9" class="0">
<segment>
<pinref part="X1" gate="G$1" pin="D-"/>
<wire x1="63.5" y1="78.74" x2="76.2" y2="78.74" width="0.1524" layer="91"/>
<wire x1="76.2" y1="78.74" x2="76.2" y2="43.18" width="0.1524" layer="91"/>
<pinref part="U$1" gate="G$1" pin="USBD-"/>
<wire x1="76.2" y1="43.18" x2="68.58" y2="43.18" width="0.1524" layer="91"/>
</segment>
</net>
<net name="N$10" class="0">
<segment>
<pinref part="X1" gate="G$1" pin="VBUS"/>
<pinref part="U2" gate="G$1" pin="IN"/>
<wire x1="63.5" y1="81.28" x2="93.98" y2="81.28" width="0.1524" layer="91"/>
<pinref part="C7" gate="G$1" pin="2"/>
<wire x1="93.98" y1="81.28" x2="101.6" y2="81.28" width="0.1524" layer="91"/>
<junction x="93.98" y="81.28"/>
</segment>
</net>
<net name="N$11" class="0">
<segment>
<pinref part="U2" gate="G$1" pin="OUT2"/>
<wire x1="116.84" y1="78.74" x2="119.38" y2="78.74" width="0.1524" layer="91"/>
<wire x1="119.38" y1="78.74" x2="119.38" y2="81.28" width="0.1524" layer="91"/>
<pinref part="U2" gate="G$1" pin="OUT1"/>
<wire x1="119.38" y1="81.28" x2="116.84" y2="81.28" width="0.1524" layer="91"/>
<wire x1="119.38" y1="81.28" x2="134.62" y2="81.28" width="0.1524" layer="91"/>
<wire x1="134.62" y1="81.28" x2="134.62" y2="88.9" width="0.1524" layer="91"/>
<junction x="119.38" y="81.28"/>
<pinref part="JP1" gate="A" pin="1"/>
<wire x1="134.62" y1="88.9" x2="132.08" y2="88.9" width="0.1524" layer="91"/>
</segment>
</net>
<net name="3V3_IN" class="0">
<segment>
<pinref part="JP2" gate="G$1" pin="2"/>
<wire x1="147.32" y1="104.14" x2="139.7" y2="104.14" width="0.1524" layer="91"/>
<wire x1="139.7" y1="104.14" x2="139.7" y2="93.98" width="0.1524" layer="91"/>
<pinref part="JP1" gate="A" pin="3"/>
<wire x1="139.7" y1="93.98" x2="132.08" y2="93.98" width="0.1524" layer="91"/>
<label x="139.7" y="96.52" size="1.778" layer="95"/>
</segment>
</net>
</nets>
</sheet>
</sheets>
</schematic>
</drawing>
<compatibility>
<note version="8.2" severity="warning">
Since Version 8.2, EAGLE supports online libraries. The ids
of those online libraries will not be understood (or retained)
with this version.
</note>
<note version="8.3" severity="warning">
Since Version 8.3, EAGLE supports URNs for individual library
assets (packages, symbols, and devices). The URNs of those assets
will not be understood (or retained) with this version.
</note>
<note version="8.3" severity="warning">
Since Version 8.3, EAGLE supports the association of 3D packages
with devices in libraries, schematics, and board files. Those 3D
packages will not be understood (or retained) with this version.
</note>
</compatibility>
</eagle>
