"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  ListItemIcon,
  Menu,
  MenuItem,
  Skeleton,
  TextField,
} from "@mui/material";
import { ChevronDown, Eye, Link2, MoreVertical, PencilLine, Search, Trash2 } from "lucide-react";
import Image from "next/image";
import { useDeleteWishlistMutation, useGetWishlistsQuery } from "@/app/services/api";
import { getErrorMessage } from "@/app/services/baseQuery";
import type { Wishlist } from "@/app/types/wishlist.types";
import { useToast } from "../Toast";
import { EmptyState, PageTitle } from "../ui";
import { longDate, useShareWishlist } from "./shared";

const PAGE = 4;
const GRID = "grid grid-cols-1 gap-3 min-[460px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
const detailHref = (id: string) => `/dashboard/wishlist/${encodeURIComponent(id)}`;

function WishlistCard({ wishlist, onDelete }: { wishlist: Wishlist; onDelete: () => void }) {
  const router = useRouter();
  const share = useShareWishlist();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const close = () => setAnchor(null);

  return (
    <div className="group relative rounded-lg border-2 border-[#E2E5EA] bg-white p-4 transition-shadow focus-within:shadow-[0_8px_24px_rgba(6,13,24,0.07)] hover:shadow-[0_8px_24px_rgba(6,13,24,0.07)]">
      <div aria-hidden className="flex h-[116px] items-center justify-center rounded-md bg-[#EAF0F5]">
        <Image src="/wishlist-file.svg" alt="wishlist" width={90} height={90} />
      </div>
      <h3 className="mt-4 text-[#0F0F0F]">
        {/* Stretched link: the whole card opens the wishlist */}
        <Link href={detailHref(wishlist.id)} className="after:absolute after:inset-0 after:rounded-lg after:content-[''] focus-visible:outline-none group-focus-within:after:outline group-focus-within:after:outline-2 group-focus-within:after:outline-[#C99532]">
          {wishlist.name}
        </Link>
      </h3>
      <div className="mt-1 flex items-center justify-between">
        <p className="text-[12px] text-[#62748E]">Opened {longDate(wishlist.openedAt)}</p>
        <IconButton
          size="small"
          aria-label={`More actions for ${wishlist.name}`}
          aria-haspopup="menu"
          onClick={(e) => setAnchor(e.currentTarget)}
          sx={{ position: "relative", zIndex: 1, mr: -0.5 }}
        >
          <MoreVertical size={16} />
        </IconButton>
      </div>

      <Menu anchorEl={anchor} open={!!anchor} onClose={close} anchorOrigin={{ vertical: "bottom", horizontal: "right" }} transformOrigin={{ vertical: "top", horizontal: "right" }}>
        <MenuItem onClick={() => (close(), router.push(detailHref(wishlist.id)))}>
          <ListItemIcon>
            <Eye size={16} />
          </ListItemIcon>
          Open
        </MenuItem>
        <MenuItem onClick={() => (close(), router.push(`${detailHref(wishlist.id)}/edit`))}>
          <ListItemIcon>
            <PencilLine size={16} />
          </ListItemIcon>
          Edit
        </MenuItem>
        <MenuItem onClick={() => (close(), share(wishlist.id, wishlist.name))}>
          <ListItemIcon>
            <Link2 size={16} />
          </ListItemIcon>
          Share link
        </MenuItem>
        <MenuItem onClick={() => (close(), onDelete())} sx={{ color: "#DC2626" }}>
          <ListItemIcon sx={{ color: "inherit" }}>
            <Trash2 size={16} />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>
    </div>
  );
}

export default function WishlistListPage() {
  const notify = useToast();
  const { data: wishlists = [], isLoading, error, refetch } = useGetWishlistsQuery();
  const [deleteWishlist, { isLoading: deleting }] = useDeleteWishlistMutation();
  const [query, setQuery] = useState("");
  const [shown, setShown] = useState(PAGE);
  const [toDelete, setToDelete] = useState<Wishlist | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? wishlists.filter((w) => w.name.toLowerCase().includes(q) || w.eventLabel?.toLowerCase().includes(q)) : wishlists;
  }, [wishlists, query]);

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await deleteWishlist(toDelete.id).unwrap();
      notify(`Deleted “${toDelete.name}”`);
      setToDelete(null);
    } catch (e) {
      notify(getErrorMessage(e), { severity: "error" });
    }
  };

  let body: React.ReactNode;
  if (error) {
    body = (
      <div className="flex flex-col items-center py-12 text-center">
        <p className="text-[14px] text-[#6B7280]">{getErrorMessage(error, "We couldn't load your wishlists.")}</p>
        <Button onClick={() => refetch()} variant="outlined" color="inherit" sx={{ mt: 2, borderColor: "#E8E8EC" }}>
          Try again
        </Button>
      </div>
    );
  } else if (isLoading) {
    body = (
      <div className={GRID} aria-busy="true" aria-label="Loading wishlists">
        {Array.from({ length: PAGE }, (_, i) => (
          <div key={i} className="rounded-lg border border-[#E2E5EA] p-3">
            <Skeleton variant="rounded" height={116} />
            <Skeleton width="70%" sx={{ mt: 1.5 }} />
            <Skeleton width="50%" />
          </div>
        ))}
      </div>
    );
  } else if (wishlists.length === 0) {
    body = (
      <div className="flex min-h-[300px] flex-col items-center justify-center">
        <EmptyState img="/empty-template.svg" title="No wishlists yet" body="Create a wishlist of gifts and cash accounts, then share one link with your guests." />
      </div>
    );
  } else if (filtered.length === 0) {
    body = <p className="py-12 text-center text-[14px] text-[#6B7280]">No wishlists match “{query}”.</p>;
  } else {
    body = (
      <>
        <div className={GRID}>
          {filtered.slice(0, shown).map((w) => (
            <WishlistCard key={w.id} wishlist={w} onDelete={() => setToDelete(w)} />
          ))}
        </div>
        {filtered.length > shown && (
          <Button
            fullWidth
            onClick={() => setShown((n) => n + PAGE * 2)}
            endIcon={<ChevronDown size={16} />}
            sx={{ mt: 7, py: 1.1, bgcolor: "#F1F4F8", color: "#0F0F0F", "&:hover": { bgcolor: "#E5EAF1" } }}
          >
            See more
          </Button>
        )}
      </>
    );
  }

  return (
    <>
      <PageTitle>Wishlist</PageTitle>

      <TextField
        fullWidth
        size="small"
        placeholder="Search for wishlist"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShown(PAGE);
        }}
        slotProps={{
          htmlInput: { "aria-label": "Search for wishlist" },
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Search size={16} />
              </InputAdornment>
            ),
          },
        }}
      />

      <div className="mt-8 flex justify-end">
        <Button component={Link} href="/dashboard/wishlist/new" variant="contained">
          Create Wishlist
        </Button>
      </div>

      <h2 className="mb-3 mt-6 text-[16px] text-[#0F0F0F]" style={{ fontFamily: '"Cal Sans", "DM Sans", sans-serif' }}>
        Recent wishlist
      </h2>
      {body}

      <Dialog open={!!toDelete} onClose={() => !deleting && setToDelete(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete this wishlist?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            “{toDelete?.name}” and its share link will stop working for your guests. This can&apos;t be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setToDelete(null)} color="inherit" disabled={deleting}>
            Cancel
          </Button>
          <Button onClick={confirmDelete} variant="contained" color="error" disabled={deleting}>
            {deleting ? "Deleting…" : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
