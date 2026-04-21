import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

const CAMPAIGNS_DATA: Record<
  string,
  {
    id: string;
    title: string;
    image: string;
    type: string;
    spent: number;
    total: number;
    deadline: string;
    brandName: string;
    brandColor: string;
    cpm: string;
    description: string;
    platforms: string[];
    contentType: string;
    status: string;
  }
> = {
  "1": {
    id: "1",
    title: "Philips Razor Promotion",
    image: "https://picsum.photos/seed/philips/800/400",
    type: "REEL",
    spent: 230,
    total: 850,
    deadline: "Oct 24, 2023",
    brandName: "Philips",
    brandColor: "#0B3D91",
    cpm: "$2.50",
    description:
      "Create an engaging short-form video showcasing the Philips OneBlade razor. Highlight the versatility, ease of use, and sleek design. Content should feel authentic and relatable to a young male audience.",
    platforms: ["YouTube", "Instagram"],
    contentType: "Short-form Video",
    status: "Active",
  },
  "2": {
    id: "2",
    title: "Nike Summer Collection",
    image: "https://picsum.photos/seed/nike/800/400",
    type: "REEL",
    spent: 500,
    total: 1200,
    deadline: "Nov 15, 2023",
    brandName: "Nike",
    brandColor: "#111111",
    cpm: "$3.00",
    description:
      "Showcase the new Nike Summer '24 collection in your unique style. Focus on lifestyle content — workouts, outdoor activities, or street style. Must feature at least one product from the collection.",
    platforms: ["YouTube", "Instagram"],
    contentType: "Short-form Video",
    status: "Active",
  },
  "3": {
    id: "3",
    title: "Apple Music Campaign",
    image: "https://picsum.photos/seed/apple/800/400",
    type: "LOGO",
    spent: 180,
    total: 600,
    deadline: "Dec 01, 2023",
    brandName: "Apple",
    brandColor: "#FB5C74",
    cpm: "$1.80",
    description:
      "Create content that highlights your music discovery experience on Apple Music. Share your favorite playlists, new artist discoveries, or how Apple Music fits into your daily routine.",
    platforms: ["Instagram"],
    contentType: "Logo Placement",
    status: "Active",
  },
  "4": {
    id: "4",
    title: "Samsung Galaxy Launch",
    image: "https://picsum.photos/seed/samsung/800/400",
    type: "REEL",
    spent: 400,
    total: 1000,
    deadline: "Jan 10, 2024",
    brandName: "Samsung",
    brandColor: "#1428A0",
    cpm: "$2.80",
    description:
      "Unbox and showcase the Samsung Galaxy S24 Ultra. Highlight camera capabilities, AI features, and design. Content should feel premium and tech-forward.",
    platforms: ["YouTube"],
    contentType: "Short-form Video",
    status: "Active",
  },
};

const DETAIL_TABS = ["Overview", "Requirements", "Submissions"] as const;
type DetailTab = (typeof DETAIL_TABS)[number];

function BackIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19 12H5M5 12L12 19M5 12L12 5"
        stroke="#FFFFFF"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ClockIcon() {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 6v6l4 2"
        stroke="#9CA3AF"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
        stroke="#9CA3AF"
        strokeWidth={2}
      />
    </Svg>
  );
}

function EyeIcon() {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
      <Path
        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
        stroke="#9CA3AF"
        strokeWidth={2}
      />
      <Path
        d="M12 9a3 3 0 100 6 3 3 0 000-6z"
        stroke="#9CA3AF"
        strokeWidth={2}
      />
    </Svg>
  );
}

export default function CampaignDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<DetailTab>("Overview");

  const campaign = id ? CAMPAIGNS_DATA[id] : null;

  if (!campaign) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Campaign not found</Text>
      </View>
    );
  }

  const progress = campaign.spent / campaign.total;

  return (
    <View style={styles.container}>
      {/* Banner image */}
      <View style={styles.bannerContainer}>
        <Image
          source={{ uri: campaign.image }}
          style={styles.bannerImage}
          contentFit="cover"
        />
        <LinearGradient
          colors={["rgba(0,0,0,0.5)", "transparent", "rgba(0,0,0,0.8)"]}
          locations={[0, 0.35, 1]}
          style={StyleSheet.absoluteFill}
        />

        {/* Brand logo on banner */}
        <View style={styles.brandLogoContainer}>
          <View
            style={[
              styles.brandLogo,
              { backgroundColor: campaign.brandColor },
            ]}
          >
            <Text style={styles.brandLogoText}>
              {campaign.brandName[0]?.toUpperCase()}
            </Text>
          </View>
          <View style={styles.brandInfo}>
            <Text style={styles.brandName}>{campaign.brandName}</Text>
            <View style={styles.statusDot}>
              <View style={styles.dot} />
              <Text style={styles.statusText}>{campaign.status}</Text>
            </View>
          </View>
        </View>

        {/* CPM badge */}
        <View style={styles.cpmBadge}>
          <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />
          <EyeIcon />
          <Text style={styles.cpmText}>
            {campaign.cpm} per 1k views
          </Text>
        </View>
      </View>

      {/* Thumbnail card above sheet */}
      <View style={styles.thumbCard}>
        <Image
          source={{ uri: campaign.image }}
          style={styles.thumbCardImage}
          contentFit="cover"
        />
        {/* Back button on thumbnail */}
        <Pressable
          onPress={() => router.back()}
          style={styles.topBackButton}
        >
          <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
          <BackIcon />
        </Pressable>
      </View>

      {/* Content sheet */}
      <BlurView
        intensity={80}
        tint="dark"
        style={styles.sheet}
      >

        {/* Glass border at top */}
        <View style={styles.sheetBorderTop} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Title */}
          <Text style={styles.title}>{campaign.title}</Text>

          {/* Meta chips */}
          <View style={styles.metaRow}>
            <View style={styles.metaChip}>
              <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
              <Text style={styles.metaChipText}>{campaign.type}</Text>
            </View>
            <View style={styles.metaChip}>
              <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
              <Text style={styles.metaChipText}>{campaign.contentType}</Text>
            </View>
            {campaign.platforms.map((p) => (
              <View key={p} style={styles.metaChip}>
                <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
                <Text style={styles.metaChipText}>{p}</Text>
              </View>
            ))}
          </View>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <BlurView intensity={25} tint="dark" style={StyleSheet.absoluteFill} />
              <Text style={styles.statValue}>${campaign.total}</Text>
              <Text style={styles.statLabel}>Total Budget</Text>
            </View>
            <View style={styles.statCard}>
              <BlurView intensity={25} tint="dark" style={StyleSheet.absoluteFill} />
              <Text style={styles.statValue}>{campaign.cpm}</Text>
              <Text style={styles.statLabel}>Per 1k Views</Text>
            </View>
            <View style={styles.statCard}>
              <BlurView intensity={25} tint="dark" style={StyleSheet.absoluteFill} />
              <View style={styles.statValueRow}>
                <ClockIcon />
                <Text style={styles.statValue}>{campaign.deadline.split(",")[0]}</Text>
              </View>
              <Text style={styles.statLabel}>Deadline</Text>
            </View>
          </View>

          {/* Budget progress */}
          <View style={styles.budgetSection}>
            <View style={styles.budgetHeader}>
              <Text style={styles.budgetLabel}>Budget Utilization</Text>
              <Text style={styles.budgetValues}>
                <Text style={styles.budgetSpent}>${campaign.spent}</Text>
                <Text style={styles.budgetTotal}> of ${campaign.total}</Text>
              </Text>
            </View>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${progress * 100}%` },
                ]}
              />
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabRow}>
            {DETAIL_TABS.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <Pressable
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  style={[
                    styles.tabButton,
                    isActive && styles.tabButtonActive,
                  ]}
                >
                  {isActive && (
                    <BlurView
                      intensity={40}
                      tint="dark"
                      style={[StyleSheet.absoluteFill, { borderRadius: 10 }]}
                    />
                  )}
                  <Text
                    style={[
                      styles.tabText,
                      isActive && styles.tabTextActive,
                    ]}
                  >
                    {tab}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Tab content */}
          <View style={styles.tabContent}>
            {activeTab === "Overview" && (
              <View style={styles.overviewContent}>
                <Text style={styles.sectionTitle}>About this campaign</Text>
                <Text style={styles.descriptionText}>
                  {campaign.description}
                </Text>

                <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
                  Brand
                </Text>
                <View style={styles.brandCard}>
                  <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
                  <View
                    style={[
                      styles.brandCardLogo,
                      { backgroundColor: campaign.brandColor },
                    ]}
                  >
                    <Text style={styles.brandCardLogoText}>
                      {campaign.brandName[0]?.toUpperCase()}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.brandCardName}>
                      {campaign.brandName}
                    </Text>
                    <Text style={styles.brandCardSub}>Verified Brand</Text>
                  </View>
                </View>
              </View>
            )}

            {activeTab === "Requirements" && (
              <View style={styles.overviewContent}>
                <Text style={styles.sectionTitle}>Content Guidelines</Text>
                <View style={styles.requirementsList}>
                  {[
                    "Video must be 15-60 seconds long",
                    "Must feature the product prominently",
                    "Original content only — no reposts",
                    "Include brand mention in caption",
                    "Post must remain live for 30 days",
                  ].map((req) => (
                    <View key={req} style={styles.requirementItem}>
                      <View style={styles.bulletDot} />
                      <Text style={styles.requirementText}>{req}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {activeTab === "Submissions" && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  No submissions yet
                </Text>
                <Text style={styles.emptyStateSubtext}>
                  Submit your first clip to this campaign
                </Text>
              </View>
            )}
          </View>

        </ScrollView>

        {/* Submit button */}
        <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
          <View style={styles.bottomBarBorder} />
          <Pressable
            style={({ pressed }) => [
              styles.submitButton,
              pressed && styles.submitButtonPressed,
            ]}
          >
            <Text style={styles.submitButtonText}>Submit a Clip</Text>
          </Pressable>
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  notFound: {
    flex: 1,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },
  notFoundText: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: "#6B7280",
  },

  // Banner
  bannerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  brandLogoContainer: {
    position: "absolute",
    bottom: 48,
    left: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  brandLogo: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.2)",
  },
  brandLogoText: {
    fontFamily: "StackSans-Bold",
    fontSize: 18,
    color: "#FFFFFF",
  },
  brandInfo: {
    gap: 2,
  },
  brandName: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
    color: "#FFFFFF",
  },
  statusDot: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#22C55E",
  },
  statusText: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#A1A1AA",
  },
  cpmBadge: {
    position: "absolute",
    bottom: 52,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  cpmText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 12,
    color: "#FFFFFF",
  },

  // Back button above thumbnail
  topBackButton: {
    position: "absolute",
    top: 12,
    left: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  // Thumbnail card above sheet
  thumbCard: {
    position: "absolute",
    top: 65,
    left: 20,
    right: 20,
    height: 190,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    zIndex: 1,
  },
  thumbCardImage: {
    width: "100%",
    height: "100%",
  },
  // Content sheet
  sheet: {
    flex: 1,
    marginTop: 270,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "transparent",
  },
  sheetBorderTop: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  scrollContent: {
    paddingTop: 24,
    paddingBottom: 120,
  },

  // Title
  title: {
    fontFamily: "StackSans-Bold",
    fontSize: 24,
    color: "#FFFFFF",
    paddingHorizontal: 20,
  },

  // Meta chips
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 20,
    marginTop: 14,
  },
  metaChip: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  metaChipText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 12,
    color: "#D1D5DB",
  },

  // Stats row
  statsRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  statCard: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: "center",
    gap: 4,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  statValue: {
    fontFamily: "StackSans-Bold",
    fontSize: 16,
    color: "#FFFFFF",
  },
  statValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statLabel: {
    fontFamily: "Inter-Regular",
    fontSize: 11,
    color: "#6B7280",
  },

  // Budget
  budgetSection: {
    paddingHorizontal: 20,
    marginTop: 20,
    gap: 8,
  },
  budgetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  budgetLabel: {
    fontFamily: "Inter-SemiBold",
    fontSize: 13,
    color: "#9CA3AF",
  },
  budgetValues: {
    fontSize: 13,
    fontFamily: "Inter-Regular",
  },
  budgetSpent: {
    color: "#EC4899",
    fontFamily: "Inter-SemiBold",
  },
  budgetTotal: {
    color: "#6B7280",
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  progressBarFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "#EC4899",
  },

  // Tabs
  tabRow: {
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 20,
    marginTop: 24,
  },
  tabButton: {
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    overflow: "hidden",
  },
  tabButtonActive: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  tabText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#6B7280",
  },
  tabTextActive: {
    fontFamily: "Inter-SemiBold",
    color: "#FFFFFF",
  },

  // Tab content
  tabContent: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  overviewContent: {
    gap: 8,
  },
  sectionTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 15,
    color: "#D1D5DB",
  },
  descriptionText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#9CA3AF",
    lineHeight: 22,
    marginTop: 4,
  },

  // Brand card
  brandCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 14,
    padding: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    marginTop: 8,
  },
  brandCardLogo: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  brandCardLogoText: {
    fontFamily: "StackSans-Bold",
    fontSize: 16,
    color: "#FFFFFF",
  },
  brandCardName: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
    color: "#FFFFFF",
  },
  brandCardSub: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#6B7280",
    marginTop: 1,
  },

  // Requirements
  requirementsList: {
    gap: 12,
    marginTop: 8,
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#EC4899",
    marginTop: 7,
  },
  requirementText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#D1D5DB",
    lineHeight: 22,
    flex: 1,
  },

  // Empty state
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
    gap: 8,
  },
  emptyStateText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#6B7280",
  },
  emptyStateSubtext: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#4B5563",
  },

  // Bottom bar
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 12,
    paddingHorizontal: 20,
  },
  bottomBarBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  submitButton: {
    backgroundColor: "#EC4899",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  submitButtonPressed: {
    opacity: 0.85,
  },
  submitButtonText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#FFFFFF",
  },
});
