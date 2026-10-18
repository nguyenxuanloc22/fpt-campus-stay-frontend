import { Building2 } from 'lucide-react';

export function HomeDormInfoSection() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50/70">
      <div className="max-w-6xl mx-auto">
        {/* Centered Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200/80 text-xs font-semibold text-[#F26522] mb-3">
            <Building2 className="w-4 h-4" />
            <span>Campus Tân Uyên • Bình Dương</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#1A365D] tracking-tight">
            Thông tin Ký túc xá Đại Học FPT
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mt-3 max-w-xl mx-auto">
            Không gian lưu trú và học tập hiện đại, thoáng mát và an toàn chuẩn quốc tế dành riêng cho sinh viên Đại học FPT
          </p>
        </div>

        {/* 3 Content Rows in Alternating Zigzag Layout */}
        <div className="space-y-16 sm:space-y-24">
          {/* ── Row 1 (Image Left, Text Right) ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center bg-white p-6 sm:p-10 rounded-3xl border border-slate-100 shadow-sm">
            <div className="overflow-hidden rounded-2xl shadow-md">
              <img
                src="/assets/ktx-overview-1.png"
                alt="Toàn cảnh Ký túc xá Đại học FPT"
                className="rounded-2xl shadow-md object-cover w-full h-[300px] md:h-[350px] hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
            <div className="text-slate-700 leading-relaxed space-y-4">
              <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider">
                01 • Môi trường &amp; Đời sống
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#1A365D]">
                Ngôi nhà thứ hai của sinh viên FPT
              </h3>
              <p className="text-sm sm:text-base leading-relaxed text-slate-600">
                Trường Đại học FPT là một trong những ngôi trường nổi tiếng đào tạo đa ngành, với chất lượng đào tạo đạt chuẩn quốc tế. Trường không chỉ quan tâm đến chất lượng đào tạo, công tác tuyển sinh mà còn chăm lo cho đời sống sinh viên. Bằng việc đầu tư, xây dựng khu Ký túc xá đầy đủ trang thiết bị cần thiết, không gian thoáng mát, sạch sẽ. Để đáp ứng nhu cầu và tạo không gian học tập, sinh hoạt thoải mái nhất cho sinh viên. KTX cũng được xem như ngôi nhà thứ 2 của nhiều sinh viên.
              </p>
            </div>
          </div>

          {/* ── Row 2 (Text Left, Image Right) ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center bg-white p-6 sm:p-10 rounded-3xl border border-slate-100 shadow-sm">
            <div className="text-slate-700 leading-relaxed space-y-4 order-2 md:order-1">
              <span className="inline-block px-3 py-1 rounded-full bg-orange-50 text-[#F26522] text-xs font-bold uppercase tracking-wider">
                02 • Tiện ích di chuyển &amp; An ninh
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#1A365D]">
                Chỗ ở lý tưởng, an tâm học tập
              </h3>
              <p className="text-sm sm:text-base leading-relaxed text-slate-600">
                Ký túc xá của trường Đại học FPT là chỗ ở dành riêng cho sinh viên của Đại học FPT. Hiện nay, một vấn đề các bạn tân sinh viên sau khi biết kết quả trúng tuyển Đại học. Đó là tìm kiếm cho mình một chỗ ở phù hợp, vừa tiết kiệm vừa đảm bảo an ninh, môi trường học tập. Không chỉ các tân sinh viên mà các bạn sinh viên các khóa trước hầu hết cũng đều mong muốn ở tại KTX trường để thuận lợi cho việc di chuyển. Và để tiết kiệm chi phí, có một môi trường để học tập và sinh hoạt.
              </p>
            </div>
            <div className="overflow-hidden rounded-2xl shadow-md order-1 md:order-2">
              <img
                src="/assets/ktx-block-2.png"
                alt="Khối nhà Ký túc xá Đại học FPT Tân Uyên"
                className="rounded-2xl shadow-md object-cover w-full h-[300px] md:h-[350px] hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          </div>

          {/* ── Row 3 (Image Left, Text Right) ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center bg-white p-6 sm:p-10 rounded-3xl border border-slate-100 shadow-sm">
            <div className="overflow-hidden rounded-2xl shadow-md">
              <img
                src="/assets/ktx-campus-3.png"
                alt="Thiết kế và tiện nghi hiện đại KTX FPT"
                className="rounded-2xl shadow-md object-cover w-full h-[300px] md:h-[350px] hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
            <div className="text-slate-700 leading-relaxed space-y-4">
              <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider">
                03 • Thiết kế &amp; Trang thiết bị
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#1A365D]">
                Thiết kế hiện đại, đầy đủ tiện nghi
              </h3>
              <p className="text-sm sm:text-base leading-relaxed text-slate-600">
                Ký túc xá trường Đại học FPT được xây dựng với thiết kế hiện đại, thoáng mát và đầy đủ tiện nghi. Khu KTX gồm các tòa nhà. Mỗi tòa KTX có các tầng rộng rãi, sạch sẽ, có cả wifi, máy bán nước tự động, máy giặt sấy tự động... Xung quanh còn là cây cối xanh mướt trong lành, dễ chịu, thoáng mát. Phòng ở được thiết kế hiện đại, không gian thoải mái, thiết kế phù hợp cho từng loại phòng 2-4-6 người. Mỗi phòng sẽ được trang bị các thiết bị cần thiết, đầy đủ phục vụ cho những nhu cầu thiết yếu của sinh viên như giường tầng, bàn học, giá phơi quần áo, bình nóng lạnh, điều hòa, tủ để giày, nhà vệ sinh riêng cho mỗi phòng… giúp sinh viên an tâm học tập trong quãng thời gian gắn bó với đại học FPT, đem đến cho sinh viên cảm giác thoải mái tiện nghi như ở nhà.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeDormInfoSection;
