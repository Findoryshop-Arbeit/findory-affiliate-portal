create policy "Review notes use the protected admin function"
on public.review_notes
for all
to authenticated
using (false)
with check (false);
